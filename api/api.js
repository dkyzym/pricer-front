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

/**
 * Logs out from a specified supplier.
 *
 * @param {string} url - The URL endpoint for the logout request.
 * @returns {Promise<{success: boolean, message: string}>} - The result of the logout operation.
 */
export const logoutFromSupplier = async (url) => {
  try {
    const response = await axios.get(url, { withCredentials: true });
    return {
      success: response.data.success,
      message: response.data.success ? 'Logout successful' : 'Logout failed',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Logout failed',
    };
  }
};
