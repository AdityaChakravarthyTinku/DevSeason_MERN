import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser, getUserDetails } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const userDetails = await getUserDetails();
      setUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout(); // Logout if token is invalid or expired
    }
  }, []); // Empty dependency array since getUserDetails does not depend on any props or state

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    if (token && userId) {
      console.log(token + '' + userId);
      setIsLoggedIn(true);
      fetchUserDetails();
      setUser({ _id: userId, role: userType });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [fetchUserDetails]); // Adding fetchUserDetails to the dependency array

  const login = async (formData, isAdminLogin) => {
    try {
      const { token, user } = await loginUser(formData, isAdminLogin);
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userType', user.role);
      localStorage.setItem('userId', user._id); // Store user ID
      setIsLoggedIn(true);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const { token, user } = await registerUser(formData);
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userType', user.role);
      localStorage.setItem('userId', user._id); // Store user ID
      setIsLoggedIn(true);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId'); // Remove user ID
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user,setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
