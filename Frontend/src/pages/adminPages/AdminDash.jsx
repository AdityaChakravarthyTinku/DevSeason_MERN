import { Link } from 'react-router-dom';

const AdminDash = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link to="/add-problem">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Add Problem
          </button>
        </Link>
        <Link to="/delete-problem">
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300">
            Delete Problem
          </button>
        </Link>
        <Link to="/update-problem">
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
            Update Problem
          </button>
        </Link>
        <Link to="/view-problems">
          <button className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300">
            View All Problems
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDash;
