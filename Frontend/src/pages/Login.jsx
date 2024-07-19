import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [isUser, setIsUser] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    admin_SecurityKey: '',  // Add this field
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { email, password, admin_SecurityKey } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const result = await login(formData);
      console.log(result);
      if (result) {
        setMessage('Login successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage('Login failed!');
      }
    } catch (err) {
      setMessage('error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-300 to-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-dark">Already Exists? Login Here 😄🧑‍💻🎓🧑‍💻😄</h2>
        {message && <p className="text-center text-gray-700">{message}</p>}
        <div className="flex justify-center mb-4">
          <button 
            className={`mr-2 px-4 py-2 ${isUser ? 'bg-primary' : 'bg-gray-300'} text-white rounded`}
            onClick={() => setIsUser(true)}
          >
            User
          </button>
          <button 
            className={`ml-2 px-4 py-2 ${isUser ? 'bg-gray-300' : 'bg-primary'} text-white rounded`}
            onClick={() => setIsUser(false)}
          >
            Admin
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-primary-dark mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <label className="block text-primary-dark mb-2" htmlFor="password">Password</label>
          <div className="mb-4 relative flex">
          
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {!isUser && (
            <div className="mb-4">
              <label className="block text-primary-dark mb-2" htmlFor="admin_SecurityKey">Admin Security Key</label>
              <input
                type="text"
                name="admin_SecurityKey"
                id="admin_SecurityKey"
                value={admin_SecurityKey}
                onChange={onChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
          >
            {isUser ? 'Login as User' : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

