import { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {

      const result = await registerUser(formData);
      console.log(result);
      setMessage('Registered successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Registration failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary-dark">Register</h2>
        {message && <p className="text-center text-gray-700">{message}</p>}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" name="name" value={name} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
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
          <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
