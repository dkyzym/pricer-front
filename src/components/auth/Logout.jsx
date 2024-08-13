import { logoutFromSupplier } from '@api/api';
import { useAuth } from '@hooks/useAuth';
import { Button, ButtonGroup, Container, Typography } from '@mui/material';
import { CREDENTIALS, SUPPLIERS } from '@utils/constants';
import { hasSupplierCookie } from '@utils/hasSupplierCookie';
import { toast } from 'react-toastify';

export const Logout = () => {
  const { logout } = useAuth();

  const handleLogout = async (supplierName) => {
    if (!hasSupplierCookie(supplierName)) {
      toast.error(`You are not logged in to ${supplierName}`);
      return;
    }

    try {
      const response = await logoutFromSupplier(
        CREDENTIALS[supplierName].logoutUrl
      );

      logout(supplierName);
      toast.success(response.message);
    } catch (error) {
      console.error(error);

      toast.error(`Logout failed`);
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
    </Container>
  );
};
