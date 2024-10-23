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
    console.error(
      `Login failed: ${error.response?.data?.message || error.message}`
    );
    throw new Error(
      `Login failed: ${error.response?.data?.message || error.message}`
    );
  }
};

export const logoutFromSupplier = async (url) => {
  try {
    const response = await axios.get(url, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(
      `Logout failed: ${error.response?.data?.message || error.message}`
    );
    throw new Error(
      `Logout failed: ${error.response?.data?.message || error.message}`
    );
  }
};
