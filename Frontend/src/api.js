import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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

export const getUserDetails = async () => {
  try {
    const response = await axiosInstance.get('/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const updateUserDetails = async (userData) => {
  try {
    const response = await axiosInstance.put('/me', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};
export const addNewProblem = async (formData) => {
  try {
    const response = await axiosInstance.post('/addproblem', formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProblem = async (ojid, formData) => {
  try {
    const response = await axiosInstance.put(`/updateproblem/${ojid}`, formData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteProblem = async (ojid) => {
  try {
    const response = await axiosInstance.delete(`/deleteproblem/${ojid}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchProblemByOjid = async (ojid) => {
  try {
    const response = await axiosInstance.get(`/getProblemByOjid/${ojid}`);
    //const data = await response.json();
    //return data;
    return response.data;
  } catch (error) {
    console.error('Error fetching problem by Ojid:', error);
    throw error;
  }
};

export const getAllProblems = async () => {
  try {
    const response = await axiosInstance.get(`/allProblems`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch problems', error);
    throw error;
  }
};

export const addTestCases = async (ojid, testCases) => {
  try {
    const response = await axiosInstance.post(`/addtestCase/${ojid}`, { testCases });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const fetchTestCases = async (problemId) => {
  try {
    const response = await axiosInstance.get(`/testCases/${problemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test cases:', error);
    throw error;
  }
};


export const deleteTestCase = async (ojid) => {
  try {
    const response = await axiosInstance.delete(`/deletetestCase/${ojid}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Function to run code
export const runCode = async (data) => {
  const response = await axiosInstance.post('/run', data);
  return response.data;
};

// Function to submit solution
export const submitSolution = async (data) => {
  try {
    console.log("Entered Submission api");
  const response = await axiosInstance.post('/submit', data);
  console.log("\n response: " + response.data);
  return response.data;
  }
  catch (error) {
    console.error('Error in submitSolution API:', error.response ? error.response.data : error.message);
    throw error;
}
};

