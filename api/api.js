import axios from 'axios';

export const loginToSupplier = async (url, username, password) => {
  try {
    const response = await axios.post(
      url,
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
