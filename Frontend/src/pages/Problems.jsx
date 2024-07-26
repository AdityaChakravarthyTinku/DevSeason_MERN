import { useEffect, useState } from 'react';
import { getAllProblems } from '../api';
import ProblemCard from '../components/ProblemCard';
import { useLocation } from 'react-router-dom';


const ViewProblems = () => {
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [topics, setTopics] = useState([]);
  const location = useLocation();



  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const topic = queryParams.get('topic');
    if (topic) {
      setSelectedTopic(topic);
    }
  }, [location]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data);

        // Get unique topics
        const uniqueTopics = [...new Set(data.map(problem => problem.topic))];
        setTopics(uniqueTopics);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 py-12 px-4">
      <div className="bg-gray-100 min-h-screen p-8 rounded-lg">
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
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
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
    </div>
  );
};

export default ViewProblems;
