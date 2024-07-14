import { useState, useContext } from 'react';
import { ProblemContext } from '../../context/ProblemContext';

const DeleteProblem = () => {
  const { deleteProblemById } = useContext(ProblemContext);
  const [problemId, setProblemId] = useState('');

  const handleChange = (e) => {
    setProblemId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await deleteProblemById(problemId);
      alert('Problem deleted successfully!');
      setProblemId('');
    } catch (error) {
      console.error('Error deleting problem:', error);
      alert('Failed to delete problem');
    }
  };

  return (
    <div className="bg-purple-700 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Delete Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="problemId" placeholder="Problem ID" value={problemId} onChange={handleChange} className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:border-purple-500" required />
          <button type="submit" className="block w-full bg-purple-700 text-white py-3 rounded-lg shadow-md hover:bg-purple-600 transition duration-300">
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeleteProblem;
