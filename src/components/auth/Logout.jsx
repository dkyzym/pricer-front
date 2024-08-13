import { useState } from 'react';
import { Button, ButtonGroup, Container, Typography } from '@mui/material';
import { logoutFromSupplier } from '../../api/api';
import { CREDENTIALS, SUPPLIERS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

export const Logout = () => {
  const [messages, setMessages] = useState(
    SUPPLIERS.reduce((acc, supplier) => ({ ...acc, [supplier.name]: '' }), {})
  );

  const { logout } = useAuth();

  const handleLogout = async (supplierName) => {
    const result = await logoutFromSupplier(
      CREDENTIALS[supplierName].logoutUrl
    );
    setMessages((prevMessages) => ({
      ...prevMessages,
      [supplierName]: result.message + ' from ' + supplierName,
    }));

    if (result.success) {
      logout(supplierName);
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Logout from
      </Typography>
      <ButtonGroup
        orientation="horizontal"
        fullWidth
        variant="outlined"
        sx={{ mb: 2 }}
      >
        {SUPPLIERS.map((supplier) => (
          <Button
            key={supplier.name}
            color={supplier.color}
            onClick={() => handleLogout(supplier.name)}
            sx={{
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            {supplier.name}
          </Button>
        ))}
      </ButtonGroup>
      {SUPPLIERS.map((supplier) => (
        <Typography
          key={supplier.name}
          variant="body2"
          color="textSecondary"
          sx={{ marginBottom: '8px' }}
        >
          {messages[supplier.name]}
        </Typography>
      ))}
    </Container>
  );
};
