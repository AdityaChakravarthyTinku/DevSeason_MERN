import { Link } from 'react-router-dom';
import Image from "../assets/user.png"
import View from "../assets/viewprob.png"

const UserDashboard = () => {
  return (
<div className="">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-4xl font-bold mb-8" >
          <h1 className=" text-emerald-50 text-center py-4">User Dashboard</h1>
      </div>
      <div className="bg-gray-100 flex ">
      
        
        <div className="bg-yellow-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-yellow-600 transition duration-300 w-1/5">
        <Link to="/view-problems">
        <img src={View} />
        <button className=" text-white text-2x1 font-bold">
            View All Problems
          </button>
        </Link>
        </div>
        
        <div className="bg-orange-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-orange-600 transition duration-300 w-1/5">
        <Link to="/profile">
        <img src={Image} />
        <button className=" text-white text-2x1 font-bold">
            View Profile
          </button>
        </Link>
        </div>
          


       
 
      </div>
    </div>
  );
};

export default UserDashboard;

