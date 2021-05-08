import React, { useState }from 'react'
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
function Download() {
    const posts = useSelector((state) => state.posts);
    // const [data, setData] = useState(posts)
  
    const objectToCsv = (data) =>{

        const csvRows  = []
        // get the headers
        let headers = Object.keys(data[0])
        csvRows.push(headers.join(','))

        // Loop over the rowsPerPage
        for(const row of data){
           const values = headers.map(header => {
               const escaped = (''+row[header]).replace(/"/g, '\\"')
                return `"${escaped}"`
            })
            csvRows.push(values.join(','))
        }
        return csvRows.join('\n')
        // Form escaped comma separated values

    }
    
    const data = posts.map(row => ({
        PatientNumber: row.patientNumber,
        PatientName: row.patientName,
        Phone: row.phoneNumber,
        Gender: row.gender,
        Age: !row.age ? (moment().diff(row.dateOfBirth, 'years')): row.age,
        BatchNumber: row.viralLoad[0]
    }))

    const download = (data) => {
        const blob = new Blob([data], {type: 'text/csv'})
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.setAttribute('hidden', '')        
        a.setAttribute('href', url)
        a.setAttribute('download', 'files.csv')
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

    }

    const handleDownload =() => {
        // console.log(data)
        const csvData = objectToCsv(data)
        download(csvData)
       
    }
    return (
        <div>
            <Button variant="contained"  onClick={handleDownload}><strong>Download</strong></Button>
        </div>
    )
}

export default Download
