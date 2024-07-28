import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { loginUser, registerUser, logoutUser, checkAuth } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const clearLocalStorage = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
  };

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      clearLocalStorage();
      setIsLoggedIn(false);
      setUser(null);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const fetchUserDetails = useCallback(async () => {
    try {
      const userDetails = await checkAuth();
      if (userDetails.authenticated) {
        setUser(userDetails.user);
        setIsLoggedIn(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();  // Ensure the useCallback-wrapped logout is used here
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');
    if (token && userId) {
      setIsLoggedIn(true);
      setUser({ _id: userId, role: userType });
      fetchUserDetails();
    } else {
      checkAuth()
        .then(response => {
          if (response.authenticated) {
            localStorage.setItem('jwtToken', response.token);
            localStorage.setItem('userType', response.user.role);
            localStorage.setItem('userId', response.user._id);
            setIsLoggedIn(true);
            setUser(response.user);
          } else {
            setIsLoggedIn(false);
            setUser(null);
            clearLocalStorage();
            logout();
          }
        })
        .catch(error => {
          console.error('Error checking authentication:', error);
          setIsLoggedIn(false);
          setUser(null);
          clearLocalStorage();
          logout();
        });
    }
  }, [fetchUserDetails,logout]);




  const login = async (formData, isAdminLogin) => {
    try {
      const { token, user } = await loginUser(formData, isAdminLogin);
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userType', user.role);
      localStorage.setItem('userId', user._id);
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
      localStorage.setItem('userId', user._id);
      setIsLoggedIn(true);
      setUser(user);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      return false;
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
