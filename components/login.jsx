import { useState } from 'react';
import axios from 'axios';

export const Login = () => {
  const [message, setMessage] = useState('');
  const [ugMessage, setUGmessage] = useState('');

  const handleTCLogin = async () => {
    const username = '32831';
    const password = '12345678';

    try {
      const response = await axios.post(
        'http://localhost:3000/login/tc',
        { username, password },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMessage('Login to LC successful');
      } else {
        setMessage('Login to LC failed');
      }
    } catch (error) {
      setMessage('Login to LC failed');
    }
  };

  const handleUGLogin = async () => {
    const username = 'automir.lg@gmail.com';
    const password = '954712';

    try {
      const response = await axios.post(
        'http://localhost:3000/login/ug',
        { username, password },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setUGmessage('Login to UG successful');
      } else {
        setUGmessage('Login to UG failed');
      }
    } catch (error) {
      setUGmessage('Login to UG failed');
    }
  };

  return (
    <>
      <h2>Login</h2>
      <button onClick={handleTCLogin}>Login TC</button>
      <button onClick={handleUGLogin}>Login UG</button>
      <p>{message}</p>
      <p>{ugMessage}</p>
    </>
  );
};
