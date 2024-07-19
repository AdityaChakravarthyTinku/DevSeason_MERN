import { useState, useEffect } from 'react';
import { getAllProblems } from '../../api';
import { Bar } from 'react-chartjs-2';

const StackedBarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const problems = await getAllProblems();
        const data = categorizeProblems(problems);
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };
    fetchProblems();
  }, []);

  const categorizeProblems = (problems) => {
    const categories = problems.reduce((acc, problem) => {
      if (!acc[problem.topic]) {
        acc[problem.topic] = { easy: 0, medium: 0, hard: 0 };
      }
      acc[problem.topic][problem.difficulty]++;
      return acc;
    }, {});

    const labels = Object.keys(categories);
    const easy = labels.map(label => categories[label].easy);
    const medium = labels.map(label => categories[label].medium);
    const hard = labels.map(label => categories[label].hard);

    return {
      labels,
      datasets: [
        {
          label: 'Easy',
          data: easy,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Medium',
          data: medium,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
        {
          label: 'Hard',
          data: hard,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        },
      ],
    };
  };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <Bar
        data={chartData}
        options={{
          indexAxis: 'y',
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
};

export default StackedBarChart;
