import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { Typography } from '@mui/material';

async function userLogin(credentials) {
  // Makes login request (POST) with supplied credentials.
  const request = await fetch(`${window.location.origin}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  return request.json();
}

async function getUserDetails(token){
  // Retrieves the relevant user details.
  const request = await fetch(`${window.location.origin}/api/users/self`, {
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return request.json();
}

export default function LoginForm()
{
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const dispatch = useDispatch();

  // This function awaits userLogin and takes it from there.
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await userLogin({
      username,
      password
    });
    // Takes the login response and determines next course of action
    // If successful, takes the token and user details and saves them
    // Thus logging in the user
    if(response.Success === true){
      const userDetails = await getUserDetails(response.Response.token);
      if(userDetails.Success === true){
        dispatch({type: "login", payload: {tokenDetails: response.Response, userDetails: userDetails.Response}});
      } else{
        // Error handling
        console.log("Invalid username / password, please check your details and try again.");
        setError("Invalid username / password, please check your details and try again.")
      }
      
    } else{
      console.log("Invalid username / password, please check your details and try again.");
      setError("Invalid username / password, please check your details and try again.")
      //Error handling
    }
  }
    return (
        <div>
        <h2>Please enter your organisation username and password to access the attendance system.</h2>
        <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
        {error?<Typography>{error}</Typography>:null}          
      </form>
        </div>

    )
}