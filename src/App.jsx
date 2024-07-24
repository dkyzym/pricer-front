import { CheckLogin } from '../components/checkLogin';
import { Login } from '../components/login';
import { SearchCode } from '../components/searchCode';
import './App.css';

function App() {
  return (
    <>
      <Login />
      <CheckLogin />
      <SearchCode />
    </>
  );
}

export default App;
