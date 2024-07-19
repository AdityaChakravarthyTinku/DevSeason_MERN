// components/StreakCard.js

import { useEffect, useState } from 'react';
import { getUserSubmissions } from '../api';

const StreakCard = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissions = await getUserSubmissions();
        const acSubmissions = submissions.filter(submission => submission.verdict === 'AC');
        acSubmissions.sort((a, b) => new Date(a.submittedTime) - new Date(b.submittedTime));

        let currentStreak = 0;
        let maxStreak = 0;
        let previousDate = null;

        for (let i = 0; i < acSubmissions.length; i++) {
          const currentDate = new Date(acSubmissions[i].submittedTime);
          if (previousDate && (currentDate - previousDate) / (1000 * 60 * 60 * 24) <= 1) {
            currentStreak++;
          } else {
            currentStreak = 1;
          }
          maxStreak = Math.max(maxStreak, currentStreak);
          previousDate = currentDate;
        }

        setStreak(maxStreak);
      } catch (error) {
        console.error('Error fetching streak data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-blue-500 p-4 rounded-lg text-white shadow-lg">
      <h2 className="text-xl font-bold">Current Streak</h2>
      <p className="text-2xl">{streak} days</p>
    </div>
  );
};

export default StreakCard;
