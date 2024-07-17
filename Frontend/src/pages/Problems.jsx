import { useEffect, useState } from 'react';
import { getAllProblems } from '../api';
import ProblemCard from '../components/ProblemCard'; // Import the ProblemCard component


const ViewProblems = () => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-4">
        {/* Search by Name */}
        <input
          type="text"
          placeholder="Search by problem title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filter by Difficulty */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Filter by Topic */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Filter by Topic</option>
          {/* Replace with your actual topic options */}
          <option value="Arrays and Matrices">Arrays And Matrices</option>
          <option value="Stacks and Queues">Stacks and Queues</option>
          <option value="Mathematics">Mathematics</option>
        </select>
      </div>

      {/* Problem Cards */}
      {problems
        .filter(problem => 
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedDifficulty ? problem.difficulty === selectedDifficulty : true) &&
          (selectedTopic ? problem.topic === selectedTopic : true)
        )
        .map(problem => (
          <ProblemCard key={problem.ojid} problem={problem} />
        ))}
    </div>
  );
};

export default ViewProblems;
