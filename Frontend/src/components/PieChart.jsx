// components/PieChart.js

import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getUserSubmissions } from '../api';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissions = await getUserSubmissions();
        console.log('Fetched submissions:', submissions);
        
        const acceptedSubmissions = submissions.filter(submission => submission.verdict === 'AC');
        const difficultyCounts = {
          easy: 0,
          medium: 0,
          hard: 0
        };

        acceptedSubmissions.forEach(submission => {
          difficultyCounts[submission.difficulty]++;
        });

        setChartData({
          labels: ['Easy', 'Medium', 'Hard'],
          datasets: [
            {
              label: 'Submissions',
            //   data: [difficultyCounts.easy, difficultyCounts.medium, difficultyCounts.hard],
              data: [3,2,4],
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data for pie chart:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Submissions by Difficulty</h2>
      {chartData ? (
        <Pie data={chartData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PieChart;