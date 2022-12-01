import { useState } from 'react';

// Custom react hook to get the JWT
export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const response = JSON.parse(tokenString);
    return response?.Response?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.Response.token);
  };

  return {
    setToken: saveToken,
    token
  }
}