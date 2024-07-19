import { deleteUser } from '../../api';
import './popup.css';
import PropTypes from 'prop-types';

const UserListPopup = ({ users, onClose }) => {

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      onClose();  // Close the popup after successful deletion
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header ">
          <h2>All Users</h2>
          <button className="popup-close" onClick={onClose}>✖</button>
        </div>
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-details">
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Date:</strong> {new Date(user.date).toLocaleDateString()}</div>
              <div><strong>Questions Solved:</strong> {user.profile.stats.problemsSolved}</div>
            </div>
            <button className="delete-button" onClick={() => handleDelete(user._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

UserListPopup.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserListPopup;
