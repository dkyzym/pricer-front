import axios from 'axios';

export const handleLogin = async (url, username, password, setMessage) => {
  try {
    const response = await axios.post(
      url,
      { username, password },
      { withCredentials: true }
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
