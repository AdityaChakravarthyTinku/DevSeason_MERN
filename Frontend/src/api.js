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

export const fetchTestCases = async (ojid) => {
  try {
    const response = await axiosInstance.get(`/testcases/${ojid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test cases:', error);
    throw error;
  }
};

export const addTestCases = async (ojid, newTestCase) => {
  try {
    const response = await axiosInstance.post(`/testcases/${ojid}`, { testCases: [newTestCase] });
    return response.data;
  } catch (error) {
    console.error('Error adding test case:', error.response?.data || error.message);
    throw error;
  }
};

export const updateTestCase = async (ojid, testCaseId, updatedTestCase) => {
  try {
    const response = await axiosInstance.put(`/testcases/${ojid}/${testCaseId}`, updatedTestCase);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const deleteTestCase = async (ojid, testCaseId) => {
  try {
    const response = await axiosInstance.delete(`/testcases/${ojid}/${testCaseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting test case:', error.response?.data || error.message);
    throw error;
  }
};


// Function to run code
export const runCode = async (data) => {
  const response = await axiosInstance.post('/run', data);
  return response.data;
};

export const getLeaderboard = async (ojid) => {
  const response = await axiosInstance.get(`/leaderboard/${ojid}`);
  return response.data;
};

// Function to submit solution
export const submitSolution = async (data) => {
  try {
    console.log("Entered Submission API");
    const response = await axiosInstance.post('/submit', data);
    console.log("\nResponse:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error in submitSolution API:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserSubmissions = async () => {
  try {
    const response = await axiosInstance.get('/submissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }
};

// Function to get problem details (assuming it exists)
export const getProblemDetails = async (problemId) => {
  try {
    const response = await axiosInstance.get(`/problem/${problemId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching problem details:', error);
    throw error;
  }
};


export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`/allUsers`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axiosInstance.delete(`/deleteUser/${userId}`);
  } catch (error) {
    console.error('Failed to delete user', error);
    throw error;
  }
};
export const getAllSubmissions = async () => {
  try {
    const response = await axiosInstance.get(`/allSubmissions`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch submissions', error);
    throw error;
  }
};
