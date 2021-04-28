import React, {useState, useEffect} from 'react'
import { AppBar, Typography, Toolbar, Avatar, Button, useMediaQuery, useTheme,Drawer, ListItem, ListItemIcon, ListItemText, IconButton, Menu } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';


import memories from '../../images/memories.png';
import * as actionType from '../../constants/actionTypes';
import { List } from '@material-ui/icons';

function CardDrawer(props) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [openDrawer, setOpenDrawer] = useState(true)
//   const classes = useStyles();
  


  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);
    return (
        <>
        <Drawer
            anchor='left'
            onClose={()=>setOpenDrawer(false)}
            open={openDrawer}
        >
            <List>
            {user ? (

                <ListItem>
                    <ListItemIcon onClick > 
                    <Button onClick={logout} >Logout</Button>
                    </ListItemIcon>
                </ListItem>
            ): 
            <ListItem>
                    <ListItemIcon>
                        <ListItemText>Sign In</ListItemText>
                    </ListItemIcon>
                </ListItem>

            }
            </List>
        </Drawer>
        <IconButton>
            <Menu />
        </IconButton>  
        </>  
    )
}

export default CardDrawer
