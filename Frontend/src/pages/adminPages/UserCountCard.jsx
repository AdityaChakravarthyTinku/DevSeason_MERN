import { useState, useEffect } from 'react';
import { getAllUsers } from '../../api';
import UserListPopup from './UserListPopup';
import './Ring.css';
import './popup.css';

const UserCountCard = () => {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUserCount(users.filter(user => user.role === 'user').length);
        setUsers(users);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => setShowPopup(true)}>
      <div className="flex flex-col items-center justify-center">
        <div className="ring-container">
          <div className="ring">
            <div className="inner-circle">{userCount}</div>
          </div>
        </div>
        <div className="mt-4 text-xl font-semibold">Number of Users</div>
      </div>
      {showPopup && <UserListPopup users={users} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default UserCountCard;
