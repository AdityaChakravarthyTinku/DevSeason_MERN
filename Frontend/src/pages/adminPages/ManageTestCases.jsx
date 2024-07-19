import { useState, useEffect } from 'react';
import {
  fetchTestCases,
  addTestCases,
  updateTestCase,
  deleteTestCase
} from '../../api';

const ManageTestCases = () => {
  const [ojid, setOjid] = useState('');
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [newTestCase, setNewTestCase] = useState({ input: '', output: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ojid) {
      const fetchTestCasesData = async () => {
        try {
          const response = await fetchTestCases(ojid);
          setProblem({ title: response.problemTitle });
          setTestCases(response.testCases);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchTestCasesData();
    }
  }, [ojid]);

  const handleAddTestCase = async () => {
    if (!newTestCase.input || !newTestCase.output) {
      setError('Input and output fields are required.');
      return;
    }

    try {
      const response = await addTestCases(ojid, newTestCase);
      console.log('Add Test Case Response:', response);
      setTestCases(prevTestCases => [...prevTestCases, response]);
    // setTestCases([...testCases, ...response.testCases]);
      setNewTestCase({ input: '', output: '' });
      setError(null);
    } catch (err) {
      console.error('Error adding test case:', err);
      setError(err.message);
    }
  };

  const handleUpdateTestCase = async (index, updatedTestCase) => {
    if (!updatedTestCase.input || !updatedTestCase.output) {
      setError('Input and output fields are required.');
      return;
    }

    try {
      await updateTestCase(ojid, updatedTestCase._id, updatedTestCase);
      const updatedCases = [...testCases];
      updatedCases[index] = updatedTestCase;
      setTestCases(updatedCases);
      setError(null);
    } catch (err) {
      console.error('Error updating test case:', err);
      setError(err.message);
    }
  };

  const handleDeleteTestCase = async (index) => {
    const testCaseId = testCases[index]?._id;
    if (!testCaseId) return;

    const updatedCases = testCases.filter((_, i) => i !== index);

    try {
      const response = await deleteTestCase(ojid, testCaseId);
      console.log('Delete Response:', response);
      setTestCases(updatedCases);
      setError(null);
    } catch (err) {
      console.error('Error deleting test case:', err);
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">Manage Test Cases</h1>
      <input
        type="text"
        value={ojid}
        onChange={(e) => setOjid(e.target.value)}
        placeholder="Enter problem OJID"
        className="mb-4 p-2 rounded border border-gray-300"
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {problem && <h2 className="text-2xl font-semibold text-white mb-4">{problem.title}</h2>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white">Add New Test Case</h3>
        <input
          type="text"
          value={newTestCase.input}
          onChange={(e) => setNewTestCase({ ...newTestCase, input: e.target.value })}
          placeholder="Input"
          className="p-2 rounded border border-gray-300 mb-2 w-full"
        />
        <input
          type="text"
          value={newTestCase.output}
          onChange={(e) => setNewTestCase({ ...newTestCase, output: e.target.value })}
          placeholder="Output"
          className="p-2 rounded border border-gray-300 mb-4 w-full"
        />
        <button
          onClick={handleAddTestCase}
          className="bg-purple-600 text-white py-2 px-4 rounded"
        >
          Add Test Case
        </button>
      </div>
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-purple-600 text-white">Input</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Output</th>
            <th className="py-2 px-4 bg-purple-600 text-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase, index) => (
            <tr key={testCase._id} className="hover:bg-purple-100">
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={testCase?.input || ''}
                  onChange={(e) =>
                    handleUpdateTestCase(index, { ...testCase, input: e.target.value })
                  }
                  className="p-2 rounded border border-gray-300 w-full"
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={testCase?.output || ''}
                  onChange={(e) =>
                    handleUpdateTestCase(index, { ...testCase, output: e.target.value })
                  }
                  className="p-2 rounded border border-gray-300 w-full"
                />
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDeleteTestCase(index)}
                  className="bg-red-600 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTestCases;