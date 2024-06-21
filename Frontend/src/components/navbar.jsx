import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [clickedButton, setClickedButton] = useState(null);

  const handleClick = (button) => {
    setClickedButton(button);
    setTimeout(() => setClickedButton(null), 300); // Reset after bounce effect
  };

  const buttons = [
    { name: 'Home', path: '/' },
    { name: 'Problems', path: '/problems' },
    { name: 'Practice', path: '/practice' },
    { name: 'Explore', path: '/explore' },
    { name: 'Login', path: '/login' },
    { name: 'Register', path: '/signup' },
  ];

  return (
    <nav className="bg-primary-dark p-4 shadow-lg relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-white text-lg font-bold flex items-center space-x-2">
            <span className="material-icons"></span>
            <Link to="/aboutus">Online Judge</Link>
          </div>
          <div className="flex space-x-4">
            {buttons.slice(0, 4).map(button => (
              <Link 
                key={button.name}
                to={button.path}
                className={`text-white hover:bg-white hover:text-primary-dark py-2 px-4 rounded transition duration-300 ${clickedButton === button.name ? 'animate-bounce' : ''}`}
                onClick={() => handleClick(button.name)}
              >
                {button.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex space-x-4">
          {buttons.slice(4).map(button => (
            <Link 
              key={button.name}
              to={button.path}
              className={`text-white hover:bg-white hover:text-primary-dark py-2 px-4 rounded transition duration-300 ${clickedButton === button.name ? 'animate-bounce' : ''}`}
              onClick={() => handleClick(button.name)}
            >
              {button.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="absolute top-0 left-0 w-10 h-10 bg-primary rounded-full transform -translate-x-4 -translate-y-4"></div>
      <div className="absolute top-0 right-0 w-10 h-10 bg-primary rounded-full transform translate-x-4 -translate-y-4"></div>

     
    </nav>
  );
}

export default Navbar;
