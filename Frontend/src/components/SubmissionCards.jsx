// components/SubmissionCards.js

import { useEffect, useState } from 'react';
import { getUserSubmissions } from '../api';

const SubmissionCards = () => {
  const [successfulCount, setSuccessfulCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissions = await getUserSubmissions();
        const successful = submissions.filter(submission => submission.verdict === 'AC').length;
        const failed = submissions.filter(submission => submission.verdict !== 'AC').length;

        setSuccessfulCount(successful);
        setFailedCount(failed);
      } catch (error) {
        console.error('Error fetching submission data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex space-x-4">
      <div className="bg-green-500 p-4 rounded-lg text-white shadow-lg">
        <h2 className="text-xl font-bold">Successful Submissions</h2>
        <p className="text-2xl">{successfulCount}</p>
      </div>
      <div className="bg-red-500 p-4 rounded-lg text-white shadow-lg">
        <h2 className="text-xl font-bold">Failed Submissions</h2>
        <p className="text-2xl">{failedCount}</p>
      </div>
    </div>
  );
};

export default SubmissionCards;
