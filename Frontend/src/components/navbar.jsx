import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-primary p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Online Judge</Link>
        <div>
          <Link to="/" className="mr-4 hover:underline">Home</Link>
          {isLoggedIn ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin-dashboard" className="mr-4 hover:underline">Admin Dashboard</Link>
              ) : (
                <Link to="/user-dashboard" className="mr-4 hover:underline">User Dashboard</Link>
              )}
              <button onClick={logout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
