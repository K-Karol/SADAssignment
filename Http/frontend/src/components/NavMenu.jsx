import React, { useState } from "react";
import { AppBar, Box, Container, Grid, IconButton, Menu, MenuItem, Toolbar, Typography, Button, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import styles from '../pages/GenerateCode/GenerateCode.module.css';
import { useSelector } from "react-redux";


// being added back in SAD-005 when I've made it persist - easy fix but wanted to get 004 up to source control first.
// Needs serious prettying up

// set restrictedroles and check for them on return??

function NavMenu() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  // const roles = useSelector((state) => state.roles);
  // const adminRoles = ["Admin", "User"];
  // console.log("These are the current user's roles" + roles);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const pages =  [<Grid container direction="row"  justifyContent="left" alignItems="left" spacing={{ xs: 1, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/">
      <Button variant ="contained"> Home</Button>
    </Link>
  </Grid>
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/editAttendance">
      <Button variant ="contained"> Edit Attendance</Button>
    </Link>
  </Grid>
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/generateCode">
      <Button variant ="contained"> Generate Code</Button>
    </Link>
  </Grid>
  
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/viewOverallAttendance">
      <Button variant ="contained"> View Overall Attendance</Button>
    </Link>
  </Grid>
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/login">
      <Button variant ="contained"> Login</Button>
    </Link>
  </Grid>
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/register">
      <Button variant ="contained"> Register</Button>
    </Link>
  </Grid>
  <Grid item xs={2} sm={4} md={4}>
    <Link to="/users">
      <Button variant ="contained"> Users</Button>
    </Link>
  </Grid>
</Grid>]
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography variant ="h6" className={styles.rainbow_text_animated} noWrap             sx={{
              mr: 2,
              display: { xs: 'flex', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}> SAD Attendance System</Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      );
};
export default NavMenu;