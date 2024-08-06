import { Logout } from '../components/auth/Logout';
import { Login } from '../components/auth/Login';

export const Auth = () => {
  return (
    <div>
      <h1>Auth Page</h1>
      <Login />
      <Logout />
    </div>
  );
};
