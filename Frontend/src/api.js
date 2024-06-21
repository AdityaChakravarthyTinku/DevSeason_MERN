import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post('/signup', formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await axiosInstance.post('/login', formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
