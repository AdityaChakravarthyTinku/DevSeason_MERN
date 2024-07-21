import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser, getUserDetails, logoutUser, checkAuth } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const fetchUserDetails = useCallback(async () => {
    try {
      const userDetails = await getUserDetails();
      console.log(userDetails);
      setUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout(); // Logout if token is invalid or expired
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    if (token && userId) {
      console.log('In Use Effect from LS \n' + token + ' ' + userId);
      setIsLoggedIn(true);
      fetchUserDetails();
      setUser({ _id: userId, role: userType });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [fetchUserDetails]);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await checkAuth();
        if (response.authenticated) {
          setIsLoggedIn(true);
          setUser(response.user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (formData, isAdminLogin) => {
    try {
      const { token, user } = await loginUser(formData, isAdminLogin);
      if (!token) {
        console.error("Token Yeda ra?");
      }
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
      if (!token) {
        console.error("Token Yeda ra?");
      }
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

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId'); // Remove user ID
      setIsLoggedIn(false);
      setUser(null);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
