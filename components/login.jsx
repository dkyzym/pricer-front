import { useState } from 'react';
import axios from 'axios';

export const Login = () => {
  const [message, setMessage] = useState('');
  const [ugMessage, setUGmessage] = useState('');

  const handleLogin = async () => {
    const username = '32831';
    const password = '12345678';

    const usernameUG = 'automir.lg@gmail.com';
    const passwordUG = '954712';

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

    try {
      const response = await axios.post(
        'http://localhost:3000/login/ug',
        { usernameUG, passwordUG },
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
      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
      <p>{ugMessage}</p>
    </>
  );
};
