import { Stack } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DBPage from './components/DBPage.jsx';
import Main from './components/Main.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
// import SideMenu from './components/SideMenu.jsx';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${window.location.origin}/api`)
        .then((res) => res.text())
        .then((text) => {setMessage(text); console.log(text); });
  }, []);

  // call DB method would go here, fetching from localhost/DB route

  // then we'd probably have to do onMount method, with callAPI/DB
  // components for various functionalities: login, 3 reqs we choose etc
  // separation of concerns :) 
  // input validation
  // async data fetching
  // containers for API calls to minimise unecessary API calls
  // route with react-router if necessary
  // probs some kind of grid/stack for interface
  // Components for the different kinds of functionality
  // Visualising, etc. will require more - i.e Graph, etc.
  // props too 

  return (
    <BrowserRouter>
        <div className="App">
          {/* <SideMenu/> */}
          <Stack direction="column" spacing={2} 
          justifyContent="center"
          alignItems="center"
          >
            <h1>Running "/api" gets you: '{message}'</h1>
          </Stack>
          <Routes>
            <Route exact path="/" element={<Main/>} />
            <Route path='/register' element={<RegistrationForm/>} />
            <Route path='/databaseTest' element={<DBPage/>} />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
