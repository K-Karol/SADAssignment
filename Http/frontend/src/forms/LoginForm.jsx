import { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux'

// Will pretty this up with Material in SAD-005 commit.
// Remove email validation as no longer needed.
// Replace with validation for usernames

// Take Logout out of here and put it somewhere else
async function userLogin(credentials) {
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

  const dispatch = useDispatch();

  // store token in local storage if it isn't already
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await userLogin({
      username,
      password
    });

    if(response.Success === true){
      const userDetails = await getUserDetails(response.Response.token);
      if(userDetails.Success === true){
        dispatch({type: "login", payload: {tokenDetails: response.Response, userDetails: userDetails.Response}});
      } else{
        //error
      }
      
    } else{
      //error
    }

    //setToken(token);
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
          </form>
        </div>
    )
}