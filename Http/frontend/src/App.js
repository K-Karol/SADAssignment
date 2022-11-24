import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DBPage from './pages/DBPage.jsx';
import Main from './pages/Main.jsx';
import NavMenu from './components/NavMenu.jsx';
import LoginForm from './forms/LoginForm';
import EditAttendance from './forms/EditAttendance.jsx';
import GenerateCode from './pages/GenerateCode/GenerateCode.jsx';
import ViewAttendance from './pages/VisualiseAttendance/ViewAttendance.jsx';
import GenerateReport from './pages/GenerateReport.jsx';
import RegisterForm from './forms/RegisterForm.jsx';
import Logout from './pages/Logout.jsx';
import useToken from './components/useToken';
// import SideMenu from './components/SideMenu.jsx';


function App() {
  // const [message, setMessage] = useState('');
  const { token, setToken } = useToken();
/*   useEffect(() => {
    fetch(`${window.location.origin}/api`)
        .then((res) => res.text())
        .then((text) => {setMessage(text); console.log(text); });
  }, []); */


  if(!token) {
    return <LoginForm setToken={setToken} />
  }

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
  // in theory could pass in roles from the token
  return (
    <BrowserRouter>
        <div className="App">
          <NavMenu/>
          
          {/* <Stack direction="column" spacing={2} 
          justifyContent="center"
          alignItems="center"
          >
          </Stack> */}
          <Routes>
            <Route exact path="/" element={<Main/>} />
            <Route path='/login' element={<LoginForm/>} />
            <Route path='/register' element={<RegisterForm/>} />
            <Route path='/databaseTest' element={<DBPage/>} />
            <Route path='/editAttendance' element={<EditAttendance/>}/>
            <Route path='/generateCode' element={<GenerateCode/>}/>
            <Route path='/viewAttendance' element={<ViewAttendance/>}/>   
            <Route path='/generateReport' element={<GenerateReport/>}/>
            <Route path='/logout' element={<Logout/>}/>
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
