import { useState, useContext, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { ProblemContext } from '../../context/ProblemContext';

const AddTestCase = () => {
  const { addTestCasesByProblemId, deleteTestCaseById, fetchTestCasesByProblemId, testCases } = useContext(ProblemContext);
  const { ojid } = useParams(); // Get the problem ID (ojid) from URL param

  const [newTestCases, setNewTestCases] = useState([{ input: '', output: '' }]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchTestCasesByProblemId(ojid);
  }, [fetchTestCasesByProblemId, ojid]);

  const handleAddTestCase = () => {
    setNewTestCases([...newTestCases, { input: '', output: '' }]);
  };

  const handleRemoveNewTestCase = (index) => {
    const updatedTestCases = [...newTestCases];
    updatedTestCases.splice(index, 1);
    setNewTestCases(updatedTestCases);
  };

  const handleRemoveExistingTestCase = async (testCaseId) => {
    try {
      await deleteTestCaseById(testCaseId, ojid);
      alert('Test case deleted successfully!');
    } catch (error) {
      console.error('Error deleting test case:', error);
      alert('Failed to delete test case');
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTestCases = [...newTestCases];
    updatedTestCases[index][name] = value;
    setNewTestCases(updatedTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTestCasesByProblemId(ojid, newTestCases);
      alert('Test cases added successfully!');
      setNewTestCases([{ input: '', output: '' }]); // Reset form
      navigate("/admin-dashboard");
    } catch (error) {
      console.error('Error adding test cases:', error);
      alert('Failed to add test cases');
    }
  };

  return (
    <div className="bg-purple-700 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4 text-purple-700">Add Test Cases for Problem ID: {ojid}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {newTestCases.map((testCase, index) => (
            <div key={index} className="space-y-2">
              <textarea
                type="text"
                name="input"
                placeholder="Input"
                value={testCase.input}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:border-purple-500"
                required
              />
              <textarea
                type="text"
                name="output"
                placeholder="Output"
                value={testCase.output}
                onChange={(e) => handleChange(e, index)}
                className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:border-purple-500"
                required
              />
              {newTestCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveNewTestCase(index)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTestCase}
            className="block w-full bg-blue-700 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Add Another Test Case
          </button>
          <button
            type="submit"
            className="block w-full bg-purple-700 text-white py-3 rounded-lg shadow-md hover:bg-purple-600 transition duration-300"
          >
            Submit Test Cases
          </button>
        </form>

        <h3 className="text-2xl font-bold mt-8 text-purple-700">Existing Test Cases</h3>
        {testCases[ojid] && testCases[ojid].map((testCase) => (
          <div key={testCase._id} className="mt-4 space-y-2 bg-gray-100 p-4 rounded-lg">
            <p><strong>Input:</strong> {testCase.input}</p>
            <p><strong>Output:</strong> {testCase.output}</p>
            <button
              type="button"
              onClick={() => handleRemoveExistingTestCase(testCase._id)}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddTestCase;
