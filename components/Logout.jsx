import { useState } from 'react';
import axios from 'axios';

export const Logout = () => {
  //   const [message, setMessage] = useState('');
  const [ugMessage, setUGmessage] = useState('');
  const [tcMessage, setTCmessage] = useState('');

  const handleLogoutUG = async () => {
    try {
      const response = await axios.get('http://localhost:3000/logout/ug', {
        withCredentials: true,
      });
      if (response.data.success) {
        setUGmessage('Logout from UG successful');
      } else {
        setUGmessage('Logout from UG failed');
      }
    } catch (error) {
      setUGmessage('Logout from UG failed');
    }
  };

  const handleLogoutTC = async () => {
    try {
      const response = await axios.get('http://localhost:3000/logout/tc', {
        withCredentials: true,
      });
      if (response.data.success) {
        setTCmessage('Logout from Turbo Cars successful');
      } else {
        setTCmessage('Logout from Turbo Cars failed');
      }
    } catch (error) {
      setTCmessage('Logout from Turbo Cars failed');
    }
  };

  return (
    <>
      <h2>Logout</h2>
      <button onClick={handleLogoutUG}>Logout UG</button>
      <button onClick={handleLogoutTC}>Logout Turbo Cars</button>

      <p>{ugMessage}</p>
      <p>{tcMessage}</p>
    </>
  );
};
