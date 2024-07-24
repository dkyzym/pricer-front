import { useState } from 'react';
import axios from 'axios';

export const Login = () => {
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const username = '32831';
    const password = '12345678';

    try {
      const response = await axios.post(
        'http://localhost:3000/login',
        { username, password },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMessage('Login successful');
      } else {
        setMessage('Login failed');
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
    </>
  );
};
