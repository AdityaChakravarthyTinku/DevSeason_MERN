import { Link } from 'react-router-dom';

import Image from "../../assets/user.png"
import View from "../../assets/viewprob.png"
import Upd from "../../assets/updated.png"
import Trash from "../../assets/trash.png"
import Add from "../../assets/add.png"
import Tc from "../../assets/tc.png"

const AdminDash = () => {
  return (
    <div className="">
      <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-4xl font-bold mb-8" >
          <h1 className=" text-emerald-50 text-center py-4">Admin Dashboard</h1>
      </div>
      <div className="bg-gray-100  flex  ">
      
       
       
        <div className="bg-green-500 m-4 text-white py-4 px-4 rounded-lg shadow-c hover:bg-green-600 transition duration-300 w-1/5">
        <Link to="/add-problem">
        <img src={Add} />
        <button className=" text-white text-2x1 font-bold">
            Add Problem
          </button>
        </Link>
        </div>
       
        <div className="bg-orange-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-orange-600 transition duration-300 w-1/5">
        <Link to="/delete-problem">
        <img src={Trash} />
        <button className=" text-white text-2x1 font-bold">
            Delete Problem
          </button>
        </Link>
        </div>
        
        <div className="bg-blue-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-blue-600 transition duration-300 w-1/5">
        <Link to="/update-problem">
        <img src={Upd} />
       
        <button className=" text-white text-2x1 font-bold">
            Update Problem
          </button>
        </Link>
        </div>
        
        <div className="bg-yellow-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-yellow-600 transition duration-300 w-1/5">
        <Link to="/view-problems">
        <img src={View} />
        <button className=" text-white text-2x1 font-bold">
            View All Problems
          </button>
        </Link>
        </div>
        
        <div className="bg-cyan-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-cyan-700 transition duration-300 w-1/5">
        <Link to="/profile">
        <img src={Image} />
        <button className=" text-white text-2x1 font-bold">
            View Profile
          </button>
        </Link>
        </div>
        
        <div className="bg-amber-500 m-4 text-white py-4 px-4 rounded-lg shadow-2xl hover:bg-amber-600 transition duration-300 w-1/5">
        <Link to="/handle-testcases">
        <img src={Tc} />
        <button className=" text-white text-2x1 font-bold">
            Handle Test Cases
          </button>
        </Link>
        </div>

       
          


       
 
      </div>
      <div className="">

<h1>This is coming soon</h1>
</div>
    </div>
  );
};

export default AdminDash;
