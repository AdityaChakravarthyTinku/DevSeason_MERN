import { useState, useEffect } from 'react';
import { getAllSubmissions } from '../../api';
import './Ring.css';

const SubmissionsCountCard = () => {
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const submissions = await getAllSubmissions();
        setSubmissionCount(submissions.length);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center">
        <div className="ring-container">
          <div className="ring">
            <div className="inner-circle">{submissionCount}</div>
          </div>
        </div>
        <div className="mt-4 text-xl font-semibold">Number of Submissions</div>
      </div>
    </div>
  );
};

export default SubmissionsCountCard;
