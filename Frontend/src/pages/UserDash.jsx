import { Link } from 'react-router-dom';
import Image from "../assets/user.png"
import View from "../assets/viewprob.png"
import PieChart from '../components/PieChart';
import BarChart from '../components/Barchart';
import SubmissionCards from '../components/SubmissionCards';
import StreakCard from '../components/StreakCard';

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
     
      <div className="p-8 flex">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            <PieChart />
          </div>
          <div className="col-span-1">
            <BarChart />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mx-2">
          <div className="col-span-2">
            <SubmissionCards />
          </div>
          <div className="row-span-2">
            <StreakCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

