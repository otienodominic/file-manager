import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import SearchBar from 'material-ui-search-bar';
import { Grid, CircularProgress, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Download from './Download'
import moment from 'moment';
import { deletePost } from '../../actions/posts';
import SearchBar from 'material-ui-search-bar';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'number', numeric: false, disablePadding: true, label: 'Patient Number' },
  { id: 'name', string: false, disablePadding: true, label: 'Patient Name' },
  { id: 'phone', numeric: true, disablePadding: false, label: 'Phone Number' },
  { id: 'age', numeric: true, disablePadding: false, label: 'Age??(Years)' },
  { id: 'gener', numeric: true, disablePadding: false, label: 'Gender' },
  { id: 'date', numeric: true, disablePadding: false, label: 'Appointment Date' },
  { id: 'batch', numeric: false, disablePadding: true, label: 'Batch Number' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

 

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all patients' }}
          />
        </TableCell> */}
        <TableCell>

        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {  
  const classes = useToolbarStyles();
  const { numSelected, post } = props;
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Patient List
        </Typography>
        <Download />
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
            <>
            <Grid>
              <Button size="small" color="secondary"  onClick={() => dispatch(deletePost(post._id))}>
                <DeleteIcon fontSize="small" /> Delete
              </Button>
            </Grid>
            <Grid>              
              <Button  style={{ color: 'white' }} size="small">
                <EditIcon fontSize="small" /> Edit
              </Button>
            </Grid>
          </>
          )}
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));



export default function Posts({ post, setCurrentId }) {
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const [data, setData] = useState(posts)
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searched, setSearched] = useState('');

  // console.log(posts[8900].creator)

  // checkedInBy creator 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = posts.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const requestSearchVal = (searchVal) => {
    const filteredRows = posts.filter((row => {
      return row.patientNumber.toString().toLowerCase().includes(searchVal.toLowerCase()) || row.patientName.toString().toLowerCase().includes(searchVal.toLowerCase())
    }))
    setData(filteredRows)
  }
  const googleAlert = () => alert('Record Deleted Successfully! refresh to view changes');
  const cancelSearch =()=>{
    setSearched('')
    requestSearchVal(searched)
  }
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, posts.length - page * rowsPerPage);
  const user = localStorage.getItem('profile');
  
  return (
    <div className={classes.root}>
      {
        user ? (
          <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <SearchBar
                placeholder='Search Patient Number or Name'
                value={searched}
                onChange={(searchVal => requestSearchVal(searchVal))}
                onCancelSearch={()=> cancelSearch()}

              />
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={posts.length}
                />
                <TableBody>
                  {!posts.length > 0 ? <CircularProgress/> :
                  (data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((post, index) => {
                      const isItemSelected = isSelected(post.patientNumber);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          // onClick={(event) => handleClick(event, post.patientNumber)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={post._id}
                          selected={isItemSelected}
                        >
                          
                          <TableCell padding="checkbox">                          
                          
                            <Button onClick={() => setCurrentId(post._id)} style={{ color: 'white' }} size="small">
                              <EditIcon color='primary' />
                            </Button>
                                                      
                            {/* <Checkbox
                              checked={isItemSelected }
                              inputProps={{ 'aria-labelledby': labelId }}
                              // onChange={setCurrentId(post._id)}
                            /> */}
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {post.patientNumber}
                          </TableCell>
                          <TableCell align="right">{post.patientName}</TableCell>
                          <TableCell align="right">{post.phoneNumber}</TableCell>
                          <TableCell align="right">{post.age ==null ? (moment().diff(post.dateOfBirth, 'years')) : post.age}</TableCell>
                          <TableCell align="right">{post.gender}</TableCell>
                          <TableCell align="right">{moment(post.appointmentDate).format('MMM Do YYYY')}</TableCell>
                          <TableCell align="right">{post.viralLoad}</TableCell>
                          <TableCell>
                          {/* {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (                            
                            )}   */}
                            <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
                              <DeleteIcon fontSize="small" /> Delete
                            </Button>                          
                          </TableCell>
                        </TableRow>
                      );
                    }))}
                  {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={posts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>

        ) : null

      }

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}




// import React from 'react';
// import { Grid, CircularProgress } from '@material-ui/core';
// import { useSelector } from 'react-redux';

// import Post from './Post/Post';
// import useStyles from './styles';

// const Posts = ({ setCurrentId }) => {
//   const posts = useSelector((state) => state.posts);
//   console.log(posts)
//   const classes = useStyles();

//   return (
//     !posts.length ? <CircularProgress /> : (
//       <Grid className={classes.container} container alignItems="stretch" spacing={3}>
//         {posts.map((post) => (
//           <Grid key={post._id} item xs={12} sm={6} md={6}>
//             <Post post={post} setCurrentId={setCurrentId} />
//           </Grid>
//         ))}
//       </Grid>
//     )
//   );
// };

// export default Posts;
