import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    console.log(tokenString);
    const response = JSON.parse(tokenString);
    console.log(response?.Response?.token);
    return response?.Response?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    console.log(JSON.stringify(userToken));
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.Response.token);
  };

  return {
    setToken: saveToken,
    token
  }
}