import { Header } from '@components/Header/Header';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer autoClose={1500} closeOnClick={true} />
    </>
  );
};

export default App;
