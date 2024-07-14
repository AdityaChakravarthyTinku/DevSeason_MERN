import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setIsLoggedIn(true);
      setUser({ _id: userId, role: userType });
    }
  }, []);

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
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
