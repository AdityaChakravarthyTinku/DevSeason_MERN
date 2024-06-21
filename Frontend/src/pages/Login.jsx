import { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isUser, setIsUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const result = await loginUser(formData);
      console.log(result);
      setMessage('Login successful!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage('Login failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-dark">Login</h2>
        {message && <p className="text-center text-gray-700">{message}</p>}
        <div className="flex justify-center mb-4">
          <button 
            className={`mr-2 px-4 py-2 ${isUser ? 'bg-primary' : 'bg-gray-300'} text-white rounded`}
            onClick={() => setIsUser(true)}
          >
            User
          </button>
          <button 
            className={`ml-2 px-4 py-2 ${!isUser ? 'bg-primary' : 'bg-gray-300'} text-white rounded`}
            onClick={() => setIsUser(false)}
          >
            Admin
          </button>
        </div>
        {isUser ? (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} id="password" name="password" value={password} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Login</button>
          </form>
        ) : (
          <form className="space-y-4">
            <div>
              <label htmlFor="securityName" className="block text-sm font-medium text-gray-700">Security Name</label>
              <input type="text" id="securityName" name="securityName" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="securityKey" className="block text-sm font-medium text-gray-700">Security Key</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} id="securityKey" name="securityKey" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Login</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
