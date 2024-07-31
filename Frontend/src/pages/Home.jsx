import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import GiggleCode from '../assets/GiggleCode.png';
import { useContext } from 'react';
import Lottie from 'react-lottie';
import codingAnimation from '../assets/codingAnimation.json';

const HomePage = () => {
  
  const { isLoggedIn, user } = useContext(AuthContext);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: codingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-4/5 lg:w-3/5 m-3 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary-dark">Welcome to The Giggle Code, {user?.name || 'User'} </h1>
        <Lottie options={defaultOptions} height={300} width={300} />

        {isLoggedIn ? (
          <div>
            <img src={GiggleCode} height={300} width={300} alt="Coding" className="mx-auto my-4" />
            <Link to="/explore" >
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
              Start Solving Problems
            </button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-center text-gray-700 mb-4">
              Please <a href="/login" className="text-blue-500 hover:underline">Login</a> or <a href="/signup" className="text-blue-500 hover:underline">Register</a> to continue.
            </p>
            <a href="#features">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">
              Learn More
            </button>
            </a>
          </div>
        )}
      </div>

      <div id="features" className="bg-white p-8 rounded shadow-md w-full sm:w-4/5 lg:w-3/5 m-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-secondary-dark">Stand Out Features</h2>
        <div className="flex flex-wrap justify-center">
          <div className="w-full sm:w-1/3 p-2">
            <div className="bg-purple-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Anyone for Online Compiler</h3>
              <p className="text-gray-700">Without Registering You can view Problems use our Compiler Services under any Problem </p>
            </div>
          </div>
          <div className="w-full sm:w-1/3 p-2">
            <div className="bg-purple-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Quadri Language Support</h3>
              <p className="text-gray-700">Register and can Attempt Submitting your Solutions for Questions in C,C++,Java,Python</p>
            </div>
          </div>
          <div className="w-full sm:w-1/3 p-2">
            <div className="bg-purple-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Interactive User Stats</h3>
              <p className="text-gray-700">Track your Progress Stats and Submissions and View Information in Visualised Way. Also maintain your Streak🔥 for Consistency
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white p-4 rounded shadow-md w-full sm:w-4/5 lg:w-3/5 m-6 text-center">
        <p className="text-gray-700">© 2024 Giggle Code All rights reserved.</p>
        <div className="flex justify-center mt-2">
          <a href="/" className="text-blue-500 hover:underline mx-2">About</a>
          <a href="/" className="text-blue-500 hover:underline mx-2">Contact</a>
          <a href="/" className="text-blue-500 hover:underline mx-2">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
