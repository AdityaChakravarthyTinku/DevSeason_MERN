import { Link } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">User Dashboard</h1>
      <div className="space-y-4">
        <Link to="/view-problems">
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">View Problems</button>
        </Link>
        <Link to="/submit-solution">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Submit Solution</button>
        </Link>
        <Link to="/profile">
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">View Profilee</button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;

