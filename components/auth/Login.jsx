import {
  Button,
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { loginToSupplier } from '../../api/api';
import { CREDENTIALS, SUPPLIERS } from '../../utils/constants';

export const Login = () => {
  const initialSupplier = SUPPLIERS[0].name;
  const initialCredentials = CREDENTIALS[initialSupplier];

  const [selectedSupplier, setSelectedSupplier] = useState(initialSupplier);
  const [loginData, setLoginData] = useState({
    username: initialCredentials.username,
    password: initialCredentials.password,
  });
  const [message, setMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSupplierChange = (e, newSupplier) => {
    if (newSupplier !== null) {
      const newCredentials = CREDENTIALS[newSupplier];
      setSelectedSupplier(newSupplier);
      setLoginData({
        username: newCredentials.username,
        password: newCredentials.password,
      });
      setMessage('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierCredentials = CREDENTIALS[selectedSupplier];
    setIsLoggingIn(true);

    try {
      const response = await loginToSupplier(
        supplierCredentials.url,
        loginData.username,
        loginData.password
      );
      if (response.success) {
        setMessage(`Login to ${selectedSupplier} successful`);
      } else {
        setMessage(`Login to ${selectedSupplier} failed`);
      }
    } catch (error) {
      setMessage(`Login to ${selectedSupplier} failed`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const currentSupplier = SUPPLIERS.find(
    (supplier) => supplier.name === selectedSupplier
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Login to
      </Typography>
      <ToggleButtonGroup
        value={selectedSupplier}
        exclusive
        onChange={handleSupplierChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        {SUPPLIERS.map((supplier) => (
          <ToggleButton
            key={supplier.name}
            value={supplier.name}
            color={supplier.color}
          >
            {supplier.name}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          value={loginData.username}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          value={loginData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color={currentSupplier.color}
          fullWidth
          disabled={isLoggingIn}
        >
          Login - {selectedSupplier}
        </Button>
      </form>
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Container>
  );
};
