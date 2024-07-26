import { useEffect, useState } from 'react';
import { getAllProblems } from '../api';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { FiBookOpen } from 'react-icons/fi';

const Explore = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  console.log(problems);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        const topicMap = {};

        data.forEach(problem => {
          if (topicMap[problem.topic]) {
            topicMap[problem.topic].push(problem);
          } else {
            topicMap[problem.topic] = [problem];
          }
        });

        setProblems(data);
        
        setTopics(topicMap);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };

    fetchProblems();
  }, []);

  const openPopup = (topic) => {
    setSelectedTopic(topic);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setSelectedTopic(null);
  };

  return (
    <div className=" min-h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-12 px-4 flex flex-wrap justify-center items-center">
      <h1 className="w-full text-3xl font-bold mb-8 text-center text-white">Explore Topics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-2">
        {Object.keys(topics).map((topic) => (
          <div
            key={topic}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer flex flex-col items-center"
            onClick={() => openPopup(topic)}
          >
            <FiBookOpen className="text-4xl text-purple-500 mb-4" />
            <h2 className="text-xl font-bold mb-2 text-center">{topic}</h2>
            <p className="text-center text-gray-700">{topics[topic].length} Questions</p>
          </div>
        ))}
      </div>

      {isOpen && selectedTopic && (
        <Dialog open={isOpen} onClose={closePopup} className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedTopic}</h2>
            <p className="mb-4">This topic contains {topics[selectedTopic].length} questions.</p>
            <ul className="list-disc list-inside mb-4">
              {topics[selectedTopic].slice(0, 5).map((problem) => (
                <li key={problem.ojid}>{problem.title}</li>
              ))}
            </ul>
            <Link
              to={`/view-problems?topic=${selectedTopic}`}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              View Problems
            </Link>
            <button
              onClick={closePopup}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300"
            >
              Close
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Explore;
