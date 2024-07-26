import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Giggle Code</Link>
        <div >
          <Link to="/" className="mr-4  mb-4 p-2 text-white rounded font-bold shadow-md w-full sm:w-96 hover:bg-gradient-to-bl to-violet-900">Home</Link>
          <Link to="/explore" className="mr-4  mb-4 p-2 text-white rounded font-bold shadow-md hover:bg-gradient-to-bl to-violet-900">Explore</Link>

          {isLoggedIn ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin-dashboard" className="mr-4  mb-4 p-2 text-white rounded font-bold shadow-md hover:bg-gradient-to-bl to-violet-900 ">Admin Dashboard</Link>
              ) : (
                <Link to="/user-dashboard" className="mr-4  mb-4 p-2 text-white rounded font-bold shadow-md hover:bg-gradient-to-bl to-violet-900">User Dashboard</Link>
              )}
              <button onClick={logout} className="mr-4  mb-4 p-2 text-white rounded font-bold shadow-md hover:bg-gradient-to-bl to-violet-900">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className=" mr-4  mb-4 p-2 text-white rounded font-bold shadow-md hover:bg-gradient-to-bl to-violet-900">Login</Link>
              <Link to="/signup" className=" mr-4  mb-4 p-2 text-white rounded font-bold shadow-md hover:bg-gradient-to-bl to-violet-900">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
