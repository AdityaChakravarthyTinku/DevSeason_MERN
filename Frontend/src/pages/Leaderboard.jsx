// src/pages/Leaderboard.js
import { useState } from 'react';
// import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([
    // Placeholder data
    { _id: '1', user: { name: 'John Doe' }, totalScore: 1000, totalTime: '1:23:45' },
    { _id: '2', user: { name: 'Jane Smith' }, totalScore: 900, totalTime: '1:15:30' }
  ]);

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       const response = await axios.get('/api/leaderboard');
//       setLeaderboard(response.data);
//     };

//     fetchLeaderboard();
//   }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Rank</th>
            <th className="py-2">Name</th>
            <th className="py-2">Score</th>
            <th className="py-2">Total Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry._id}>
              <td className="py-2">{index + 1}</td>
              <td className="py-2">{entry.user.name}</td>
              <td className="py-2">{entry.totalScore}</td>
              <td className="py-2">{entry.totalTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
