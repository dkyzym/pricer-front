import CssBaseline from '@mui/material/CssBaseline';

const AppProviders = ({ children }) => {
  return (
    <>
      <CssBaseline />
      {children}
    </>
  );
};

export default AppProviders;
