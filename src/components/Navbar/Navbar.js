import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button, IconButton,  Drawer, MenuItem,} from '@material-ui/core';
import {Menu as MenuIcon} from '@material-ui/icons'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';

import memories from '../../images/memories.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';

const Navbar = (props) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const {toolbar, profile, purple, brandContainer, heading, appBar, image, userName, drawerContainer } = useStyles();  
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;
  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);

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
  }, [location, logout]);

  const displayDesktop = () => {
    return ( 

      <Toolbar className={toolbar}>      
      {user?.result ? (
        <div className={profile}>
          <Avatar className={purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
          <Typography className={userName} variant="h6">{user?.result.name}</Typography>
          <Button variant="contained" className={logout} color="secondary" onClick={logout}>Logout</Button>
        </div>
      ) : (
        <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
      )}
    </Toolbar> 
   
    );   
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
          {...{
            edge: false,
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>

        {/* <div>{femmecubatorLogo}</div> */}
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {    
      return (
        <>
          {
            user?.result ? 
            (
              <>
              <Avatar className={purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
              <Typography className={userName} variant="h6">{user?.result.name}</Typography>
              <Button variant="contained" className={logout} color="secondary" onClick={logout}>Logout</Button>
              </>
            ): 
            (<>
            <Button component={Link} to="/auth" variant="contained" color="primary">
              Sign In
            </Button> 
            </>           
            )
          }
        </>       
     
      )
   
  };


  const femmecubatorLogo = (
    <div className={brandContainer}>
        <Typography component={Link} to="/" className={heading} variant="h5" align="left">File Management System</Typography>
        <img className={image} src={memories} alt="icon" height="60" />
    </div>
  );
 

  return (
    <AppBar className={appBar} position="static" color="inherit">
      {femmecubatorLogo}
        {mobileView ? displayMobile() : displayDesktop()}
    </AppBar>
  );
};

export default Navbar;
