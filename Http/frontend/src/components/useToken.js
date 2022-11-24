import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    console.log(tokenString);
    const userToken = JSON.parse(tokenString);
    console.log(userToken?.token);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    console.log(JSON.stringify(userToken));
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.Response.token);
  };

  return {
    setToken: saveToken,
    token
  }
}