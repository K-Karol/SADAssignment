import React, { useState } from "react";
import { AppBar, Container, Toolbar, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '../pages/GenerateCode/GenerateCode.module.css';


// being added back in SAD-005 when I've made it persist - easy fix but wanted to get 004 up to source control first.
function NavMenu() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant ="h4" className={styles.rainbow_text_animated} noWrap> SAD Attendance System</Typography>
          <div className="navigation-links">
          <Stack direction="row" spacing={2}>
                    <Link to="/">
                        <Button variant ="contained"> Home</Button>
                    </Link>
                    <Link to="/editAttendance">
                        <Button variant ="contained"> Edit Attendance</Button>
                    </Link>
                    <Link to="/generateCode">
                        <Button variant ="contained"> Generate Code</Button>
                    </Link>
                    <Link to="/viewAttendance">
                        <Button variant ="contained"> View Attendance</Button>
                    </Link>
                    <Link to="/generateReport">
                        <Button variant ="contained"> Generate Report</Button>
                    </Link>
                    <Link to="/databaseTest">
                        <Button variant ="contained"> Databases</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant ="contained"> Login</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant ="contained"> Register</Button>
                    </Link>
            </Stack>       
          </div>
        </Toolbar>
      </Container>

    </AppBar>
  );
};

export default NavMenu;