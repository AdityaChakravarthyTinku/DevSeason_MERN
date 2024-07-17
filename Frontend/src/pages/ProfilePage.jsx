import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUserDetails } from '../api';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission prevented');
    try {
      console.log('Submitting form with data:', formData);
      const updatedUser = await updateUserDetails(formData);
      console.log('Updated User:', updatedUser);
      
      // Update user context with the updated user data
      setUser(updatedUser);
      
      // Update local state to reflect changes
      setFormData({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        bio: updatedUser.profile?.bio || '',
      });

      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const enterEditMode = () => {
    console.log('Entering Edit Mode');
    setEditMode(true);
  };

  const exitEditMode = () => {
    console.log('Exiting Edit Mode');
    setEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-700">User Profile</h2>
        <div className="flex items-center space-x-4">
          <img
            src="/profile-icon.svg" // Replace with your profile icon image
            alt="Profile"
            className="h-8 w-8"
          />
          <span className="text-gray-600">{user && user.name}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            readOnly={!editMode}
            required
            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            readOnly={!editMode}
            required
            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={user?.role || ''}
            readOnly
            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Joined Date
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={user ? new Date(user.date).toLocaleDateString() : ''}
            readOnly
            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            readOnly={!editMode}
            required
            rows={3}
            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Stats</label>
          <div className="mt-1 space-y-2">
            <p className="text-gray-600">Problems Solved: {user?.profile?.stats?.problemsSolved || 0}</p>
            <p className="text-gray-600">Total Attempts: {user?.profile?.stats?.totalAttempts || 0}</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Progress Tracker</label>
          <ul className="mt-1 space-y-2">
            {user?.profile?.progressTracker?.map((tracker, index) => (
              <li key={index} className="text-gray-600">
                {tracker.topicName}: {tracker.problemsSolved}
              </li>
            ))}
          </ul>
        </div>

        {!editMode ? (
          <button
            type="button"
            onClick={enterEditMode}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            Update Profile
          </button>
        ) : (
          <div className="space-x-4">
            <button
              type="submit"
              className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={exitEditMode}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
