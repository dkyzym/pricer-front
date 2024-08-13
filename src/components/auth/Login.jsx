import { loginToSupplier } from '@api/api';
import { useAuth } from '@hooks/useAuth';
import {
  Button,
  Container,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CREDENTIALS, SUPPLIERS } from '@utils/constants';
import { findShortName } from '@utils/findShortName';
import { useState } from 'react';
import { toast } from 'react-toastify';

export const Login = () => {
  const initialSupplier = SUPPLIERS[0].name;
  const initialCredentials = CREDENTIALS[initialSupplier];

  const [selectedSupplier, setSelectedSupplier] = useState(initialSupplier);

  const [loginData, setLoginData] = useState({
    username: initialCredentials.username,
    password: initialCredentials.password,
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { login } = useAuth();

  const handleSupplierChange = (_e, newSupplier) => {
    if (newSupplier !== null) {
      const newCredentials = CREDENTIALS[newSupplier];

      setSelectedSupplier(newSupplier);

      setLoginData({
        username: newCredentials.username,
        password: newCredentials.password,
      });
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
        supplierCredentials.loginUrl,
        loginData.username,
        loginData.password
      );
      toast.success(response.message);
      login(findShortName(selectedSupplier));
    } catch (error) {
      console.error(error);
      toast.error(`Login to ${selectedSupplier} failed`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const currentSupplier = SUPPLIERS.find(
    (supplier) => supplier.name === selectedSupplier
  );

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
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
    </Container>
  );
};
