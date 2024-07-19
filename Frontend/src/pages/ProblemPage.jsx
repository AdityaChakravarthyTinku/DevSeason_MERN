import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProblemByOjid, runCode, submitSolution } from '../api'; // Adjust path as per your file structure
import EditorTabs from '../components/OutputTabs'; // Assuming you have a component for tabs
import FortBulb from '../components/Bulb';
import { AuthContext } from '../context/AuthContext';
import Editor from '@monaco-editor/react';

const ProblemLayout = () => {
    const { ojid } = useParams(); // Assuming your route provides the problem ID
    const { user } = useContext(AuthContext);
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [input, setInput] = useState(''); // To store input for running code
    const [output, setOutput] = useState(''); // To store output

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const data = await fetchProblemByOjid(ojid); // Fetch problem details by ojid
                setProblem(data);
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };
        fetchProblem();
    }, [ojid]);

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
        // Automatically set code based on selected language and existing problem's codeInput
        const language = e.target.value;
        const selectedCode = problem.codeInput.find(item => item.language === language)?.template || '';
        setCode(selectedCode);
    };

    const handleRun = async () => {
        console.log('Running code...');
        try {
            const data = { language: selectedLanguage, code, input };
            const result = await runCode(data);
            setOutput(result.output); // Set output to display in the Output tab
        } catch (error) {
            console.error('Error running code:', error);
            // Handle error
        }
    };

    const handleSubmit = async () => {
        try {
            console.log("Submitting Code begins..."); 
            if (!user || !user._id) {
                console.error('User is not authenticated or user ID is missing.');
                console.log('User is not authenticated or user ID is missing.');
                alert('Please see the user details');
                return;
              }
          
            console.log(user);
            console.log(problem); // Log problem to inspect

            const data = {
                userId: user._id,
                problemId: problem._id,
                language: selectedLanguage,
                code
            };
            console.log('Submission Data:', data); // Log data to inspect
            const result = await submitSolution(data);
            console.log('Submission Result:', result); // Log result to inspect
            setOutput(`Verdict: ${result.solution.verdict}, Runtime: ${result.solution.runtime}, Penalty: ${result.solution.penaltyScore}`); // Set output to display in the Output tab
        } catch (error) {
            console.error('Error submitting solution:', error);
            // Handle error
        }
    };

    if (!problem) return (
        <div className="in-h-screen bg-gradient-to-r from-purple-400 to-pink-400 py-12 px-4">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-xl align-middle'><b>No Such Problem 😄 Please Explore Other Problems</b></h1>
                </div>
            </div>
        </div>
    );

    return (
        <div className="in-h-screen bg-gradient-to-r from-purple-400 to-pink-400 py-12 px-4">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="mt-6 text-2xl font-bold">{problem.title}</h2>
                        <p className="text-lg text-gray-600">{problem.topic}</p>
                        <p className={`mt-5 text-sm font-bold ${problem.difficulty === 'easy' ? 'text-green-600' : (problem.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-600')}`}>
                            Difficulty: {problem.difficulty}
                        </p>
                    </div>
                    {problem.tutorialLink && (
                        <a href={problem.tutorialLink} target="_blank" rel="noopener noreferrer">
                            <FortBulb />
                        </a>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">Statement</h3>
                        <p className="text-med">{problem.statement}</p>
                    </div>
                    <div>
                        <select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select Language</option>
                            <option value="c">C</option>
                            <option value="cpp">C++</option>
                            <option value="py">Python</option>
                            <option value="java">Java</option>
                        </select>
                        <Editor
                            height="50vh"
                            language={selectedLanguage || 'javascript'}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value)}
                            options={{
                                selectOnLineNumbers: true,
                            }}
                            className="mt-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={handleRun}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Run
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Submit
                            </button>
                        </div>
                        <EditorTabs input={input} setInput={setInput} output={output} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemLayout;
