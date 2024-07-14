import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { addNewProblem, updateProblem, deleteProblem, addTestCases, deleteTestCase,fetchTestCases} from '../api';

export const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const [testCases, setTestCases] = useState({});
  const [error, setError] = useState(null);

  const addProblem = async (formData) => {
    try {
      const data = await addNewProblem(formData);
      setProblems([...problems, data.problem]);
    } catch (error) {
      console.error('Error adding problem:', error);
      setError('Error adding problem: Server error');
    }
  };

  const updateProblemById = async (ojid, formData) => {
    try {
      const data = await updateProblem(ojid, formData);
      setProblems(problems.map((problem) => (problem.ojid === ojid ? data.problem : problem)));
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

  const deleteProblemById = async (ojid) => {
    try {
      await deleteProblem(ojid);
      setProblems(problems.filter((problem) => problem.ojid !== ojid));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  const addTestCasesByProblemId = async (ojid, testCases) => {
    try {
      const data = await addTestCases(ojid, testCases);
      setTestCases({ ...testCases, [ojid]: [...(testCases[ojid] || []), ...data.testCases] });
    } catch (error) {
      console.error('Error adding test cases:', error);
      setError('Error adding test cases: Server error');
    }
  };

  const deleteTestCaseById = async (testCaseId, ojid) => {
    try {
      await deleteTestCase(testCaseId);
      setTestCases({
        ...testCases,
        [ojid]: testCases[ojid].filter((testCase) => testCase._id !== testCaseId),
      });
    } catch (error) {
      console.error('Error deleting test case:', error);
      setError('Error deleting test case: Server error');
    }
  };

  const fetchTestCasesByProblemId = async (problemId) => {
    try {
      const data = await fetchTestCases(problemId);
      setTestCases(data.testCases);
    } catch (error) {
      console.error('Error fetching test cases:', error);
      setError('Error fetching test cases: Server error');
    }
  };



  return (
    <ProblemContext.Provider value={{
      problems,
      testCases,
      error,
      addProblem,
      updateProblemById,
      deleteProblemById,
      addTestCasesByProblemId,
      deleteTestCaseById,
      fetchTestCasesByProblemId,
    }}>
      {children}
    </ProblemContext.Provider>
  );
};

ProblemProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProblemContext;
