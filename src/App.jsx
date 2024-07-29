import { Login } from '../components/Login';
import { Logout } from '../components/Logout';
import { ToastContainer } from 'react-toastify';
import Drawer from '@mui/material/Drawer';
// import { SearchCode } from '../components/SearchCode';

import { SearchComponent } from '../components/SearchFastUg';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Drawer open={true} variant="permanent">
        <Login />
        <Logout />
      </Drawer>

      <SearchComponent />
      {/* <SearchCode /> */}
      <ToastContainer autoClose={1500} closeOnClick />
    </>
  );
}

export default App;
