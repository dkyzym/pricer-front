import { useState, useEffect } from 'react';
import axios from 'axios';

export const CheckLogin = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('http://localhost:3000/check-login', {
          withCredentials: true,
        });
        if (response.data.loggedIn) {
          setStatus('Logged in');
        } else {
          setStatus('Not logged in');
        }
      } catch (error) {
        setStatus('Error checking login status');
      }
    };

    checkLogin();
  }, []);

  return (
    <div>
      <h2>Login Status</h2>
      <p>{status}</p>
    </div>
  );
};
