import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from './components/Header/Header';
import { ScrollToTopButton } from './components/buttons/ScrollToTopButton';

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer
        autoClose={1500}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable={false}
      />
      <ScrollToTopButton />
    </>
  );
};

export default App;
