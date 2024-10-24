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

// https://api.pr-lg.ru/search/items?secret=7xjfp7Mani6MANWSO9Q973T-TtoBN49Z&article=oc90&brand=MAHLE/KNECHT

// https://api.pr-lg.ru/search/products?secret=7xjfp7Mani6MANWSO9Q973T-TtoBN49Z&article=2382
