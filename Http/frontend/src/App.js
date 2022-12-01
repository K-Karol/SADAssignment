import React from 'react'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/Main.jsx';
import NavMenu from './components/NavMenu.jsx';
import LoginForm from './forms/LoginForm';
import EditAttendance from './forms/EditAttendance.jsx';
import GenerateCode from './pages/GenerateCode/GenerateCode.jsx';
import ViewAttendance from './pages/VisualiseAttendance/ViewAttendance.jsx';
import Logout from './pages/Logout.jsx';
import { useSelector } from 'react-redux'
import UserTable from './pages/VisualiseAttendance/UserTable.jsx';
import { Box, Grid, CssBaseline, IconButton } from '@mui/material';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const isLoggedIn = useSelector(state => state.isLoggedIn); //does not persist refresh
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  if(!isLoggedIn) {
    return <LoginForm />
  }
  
  return (
    <div className="App">
      <Grid item xs={4}>
      <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
      }}
    >
      {theme.palette.mode} mode
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Box>        
    <BrowserRouter>
          <div className="routes">
            <NavMenu/>
            <Routes>
              <Route exact path="/" element={<Main/>} />
              <Route path='/login' element={<LoginForm/>} />
              <Route path='/editAttendance' element={<EditAttendance/>}/>
              <Route path='/generateCode' element={<GenerateCode/>}/>
              <Route path='/viewAttendance' element={<ViewAttendance/>}/> 
              <Route path='/logout' element={<Logout/>}/>
              <Route path='/users' element={<UserTable/>}/>
            </Routes>
          </div>
      </BrowserRouter>
    </Grid>
    </div>

  );
}

export default function ToggleColorMode() {
    const [mode, setMode] = React.useState('light');
    const colorMode = React.useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
      }),
      [],
    );
  
    const theme = React.useMemo(
      () =>
        createTheme({
          palette: {
            mode,
          },
        }),
      [mode],
    );
    return (
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
          <CssBaseline />
            <App/>
        </ThemeProvider>
        </ColorModeContext.Provider>
      );
}

