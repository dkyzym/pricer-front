import { Login } from '../components/Login';
import { Logout } from '../components/Logout';
import { SearchCode } from '../components/SearchCode';

import { SearchComponent } from '../components/SearchFastUg';

import './App.css';

function App() {
  return (
    <>
      <Login />
      <Logout />
      <SearchCode />
      <SearchComponent />
    </>
  );
}

export default App;
