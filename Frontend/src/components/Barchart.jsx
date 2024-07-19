// components/BarChart.js

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getUserSubmissions, getProblemDetails } from '../api';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
          {
            label: 'Submissions',
            data: [{
                x: 'Topic 1',
                y: 3
  
            },
            {
                x: 'Topic 2',
                y: 2
            },
            {
                x: 'Topic 3',
                y: 1
            }
        ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissions = await getUserSubmissions();
        console.log('Fetched submissions:', submissions);
        
        const acceptedSubmissions = submissions.filter(submission => submission.verdict === 'AC');
        const topicCounts = {};

        for (let submission of acceptedSubmissions) {
          const problemDetails = await getProblemDetails(submission.problemId);
          const topic = problemDetails.topic;
          if (topicCounts[topic]) {
            topicCounts[topic]++;
          } else {
            topicCounts[topic] = 1;
          }
        }

        setChartData({
          labels: Object.keys(topicCounts),
          datasets: [
            {
              label: 'Submissions',
              data: Object.values(topicCounts),
              backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data for bar chart:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Submissions by Topic</h2>
      {chartData ? (
        <Bar data={chartData} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default BarChart;