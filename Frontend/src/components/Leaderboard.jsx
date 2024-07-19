import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import { getLeaderboard } from '../api.js';

const Leaderboard = () => {
  const { ojid } = useParams();  // Use useParams to get ojid from URL
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(ojid);
        setLeaderboard(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [ojid]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto my-8 p-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Leaderboard</h1>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-purple-600 text-white">Name</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Email</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Language</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Runtime</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Penalty</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Submitted Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className="hover:bg-purple-100">
              <td className="py-2 px-4">{entry.userName}</td>
              <td className="py-2 px-4">{entry.userEmail}</td>
              <td className="py-2 px-4">{entry.language}</td>
              <td className="py-2 px-4">{entry.runtime}</td>
              <td className="py-2 px-4">{entry.penaltyScore}</td>
              <td className="py-2 px-4">{new Date(entry.submittedTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default Leaderboard;
