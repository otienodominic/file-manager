import React, { useState } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
// import injectTapEventPlugin from "react-tap-event-plugin";
import orderBy from "lodash/orderBy";
import { useSelector, useDispatch } from 'react-redux';
import { deletePost } from '../../actions/posts';
// import logo from "../../logo.svg";
import "../../App.css";
// import Form from "./Form";
import Table from "./Table";

// injectTapEventPlugin();

const invertDirection = {
  asc: "desc",
  desc: "asc"
};

function Ninja() {
const posts = useSelector((state) => state.posts);
const [data, setData] = useState(posts)
const [editIdx, setEditIdx] = useState(-1)
const [columnToSort, setColumnToSort] = useState('')
const [sortDirection, setSortDirection] = useState('desc')    
  

  const handleRemove = i => {
    setData(
      data.filter((row, j) => j !== i)
    );
  };

  const startEditing = i => {
    setEditIdx({ editIdx: i });
  };

  const stopEditing = () => {
    setEditIdx({ editIdx: -1 });
  };

  const handleChange = (e, name, i) => {
    const { value } = e.target;
    setData(
      data.map(
        (row, j) => (j === i ? { ...row, [name]: value } : row)
      )
    );
  };

//   const handleSort = columnName => {
//     this.setState(state => ({
//       columnToSort: columnName,
//       sortDirection:
//         state.columnToSort === columnName
//           ? invertDirection[state.sortDirection]
//           : "asc"
//     }));
//   };

   return (
      <MuiThemeProvider>
        <div className="App">         
          <Table
            // handleSort={this.handleSort}
            handleRemove={handleRemove}
            startEditing={startEditing}
            editIdx={editIdx}
            stopEditing={stopEditing}
            handleChange={handleChange}
            columnToSort={columnToSort}
            sortDirection={sortDirection}
            // data={orderBy(
            //   data,
            //   columnToSort,
            //   sortDirection
            // )}
            data={data}
            header={[
              {
                name: "First name",
                prop: "firstName"
              },
              {
                name: "Last name",
                prop: "lastName"
              },
              {
                name: "Username",
                prop: "username"
              },
              {
                name: "Email",
                prop: "email"
              }
            ]}
          />
        </div>
      </MuiThemeProvider>
    );  
}

export default Ninja;



