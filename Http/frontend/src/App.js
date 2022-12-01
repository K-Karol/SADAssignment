import React from 'react'; // {useState, useEffect}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/Main.jsx';
import NavMenu from './components/NavMenu.jsx';
import LoginForm from './forms/LoginForm';
import EditAttendance from './forms/EditAttendance.jsx';
import GenerateCode from './pages/GenerateCode/GenerateCode.jsx';
import ViewAttendance from './pages/VisualiseAttendance/ViewAttendance.jsx';
import RegisterForm from './forms/RegisterForm.jsx';
import Logout from './pages/Logout.jsx';
import { useSelector } from 'react-redux'
import UserTable from './pages/VisualiseAttendance/UserTable.jsx';
// import ViewOverallAttendance from './pages/VisualiseAttendance/ViewOverallAttendance.jsx';

function App() {
  const isLoggedIn = useSelector(state => state.isLoggedIn); //does not persist refresh

  if(!isLoggedIn) {
    return <LoginForm />
  }
  return (
    <BrowserRouter>
        <div className="App">
          <NavMenu/>
          <Routes>
            <Route exact path="/" element={<Main/>} />
            <Route path='/login' element={<LoginForm/>} />
            {/* <Route path='/register' element={<RegisterForm/>} /> */}
            <Route path='/editAttendance' element={<EditAttendance/>}/>
            <Route path='/generateCode' element={<GenerateCode/>}/>
            <Route path='/viewAttendance' element={<ViewAttendance/>}/> 
            {/* <Route path="/viewOverallAttendance" element={<ViewOverallAttendance/>}/>   */}
            <Route path='/logout' element={<Logout/>}/>
            <Route path='/users' element={<UserTable/>}/>
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
