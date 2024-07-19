import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar';

import { AuthProvider } from './context/AuthContext';
import { ProblemProvider } from './context/ProblemContext';


import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/adminPages/AdminDash';
import UserDashboard from './pages/UserDash';
import AddProblemForm from './pages/adminPages/AddProblem';
import AddTestCase from './pages/adminPages/AddTestCase';
import DeleteProblem from './pages/adminPages/DeleteProblem';
import UpdateProblem from './pages/adminPages/UpdateProblem';

import ProblemPage from './pages/ProblemPage';

import UserProfile from './pages/ProfilePage';
import Leaderboard from './components/Leaderboard';
import ViewProblems from './pages/Problems';
import ManageTestCases from './pages/adminPages/ManageTestCases';


const App = () => {
  return (
    <AuthProvider>
      <ProblemProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/add-problem" element={<AddProblemForm />} />
            <Route path="/addtestcase/:ojid" element={<AddTestCase />} />
            <Route path="/delete-problem" element={<DeleteProblem />} />
            <Route path="/update-problem" element={<UpdateProblem />} />
            <Route path="/problem-page/:ojid" element={<ProblemPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/leaderboard/:ojid" element={<Leaderboard />} />
            <Route path="/handle-testcases" element={<ManageTestCases />} />
            <Route path="/view-problems" element={<ViewProblems />} />
          </Routes>
        </Router>
      </ProblemProvider>
    </AuthProvider>
  );
};

export default App;
