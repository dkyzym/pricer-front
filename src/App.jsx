import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HeaderComponent } from './components/HeaderComponent/HeaderComponent';

const App = () => {
  return (
    <>
      <HeaderComponent />
      <Outlet />
      <ToastContainer autoClose={1500} closeOnClick={true} />
    </>
  );
};

export default App;
