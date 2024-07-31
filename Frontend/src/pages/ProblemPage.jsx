import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProblemByOjid, runCode, submitSolution } from '../api';
import EditorTabs from '../components/OutputTabs';
import FortBulb from '../components/Bulb';
import { AuthContext } from '../context/AuthContext';
import Editor from '@monaco-editor/react';

const ProblemLayout = () => {
    const { ojid } = useParams();
    const { user } = useContext(AuthContext);
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [testCaseResults, setTestCaseResults] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [shouldSwitchTab, setShouldSwitchTab] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const data = await fetchProblemByOjid(ojid);
                setProblem(data);
            } catch (error) {
                console.error('Error fetching problem:', error);
            }
        };
        fetchProblem();
    }, [ojid]);

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
        const language = e.target.value;
        const selectedCode = problem.codeInput.find(item => item.language === language)?.template || '';
        setCode(selectedCode);
    };

    const handleRun = async () => {
        if (!selectedLanguage || !code) {
            console.error('Language or code is not defined');
            setLoadingMessage('Error: Language or code is not defined');
            return;
        }

        setLoadingMessage('Running...');
        setOutput('');
        setTestCaseResults([]); // Clear previous test case results
        setShouldSwitchTab(true);

        try {
            const data = { language: selectedLanguage, code, input };
            console.log('Running code with data:', data); // Debugging log
            const result = await runCode(data);
            setOutput(result.output);
            setLoadingMessage(''); // Clear loading message
        } catch (error) {
            console.error('Error running code:', error);
            setLoadingMessage('Error running code'); // Show error if any
        }
    };

    const handleSubmit = async () => {
        if (!user || !user._id) {
            alert('Please log in to submit.');
            return;
        }

        if (!selectedLanguage || !code) {
            console.error('Language or code is not defined');
            setLoadingMessage('Error: Language or code is not defined');
            return;
        }

        setLoadingMessage('Submitting...');
        setOutput('');
        setTestCaseResults([]); // Clear previous test case results
        setShouldSwitchTab(true);

        try {
            const data = {
                userId: user._id,
                problemId: problem._id,
                language: selectedLanguage,
                code
            };
            console.log('Submitting solution with data:', data); // Debugging log
            const result = await submitSolution(data);
            console.log("\n\n\n\n\n\nThis is result:", JSON.stringify(result.testCaseResults, null, 2), "\n\n\n\n\n\n");
            setOutput(`Verdict: ${result.solution.verdict}, Runtime: ${result.solution.runtime}, Penalty: ${result.solution.penaltyScore}`);
            setTestCaseResults(result.testCaseResults); // Fixed this line to use testCaseResults from result

            setLoadingMessage(''); // Clear loading message
        } catch (error) {
            console.error('Error submitting solution:', error);
            setLoadingMessage('Error submitting solution'); // Show error if any
        }
    };

    if (!problem) return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 py-12 px-4">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className='text-xl align-middle'><b>No Such Problem 😄 Please Explore Other Problems</b></h1>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-400 to-pink-400 py-12 px-4">
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
                            {problem.codeInput.map((item) => (
                                <option key={item.language} value={item.language}>
                                    {item.language}
                                </option>
                            ))}
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
                                className="bg-secondary-dark text-white px-4 py-2 rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Run
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-primary-dark text-white px-4 py-2 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Submit
                            </button>
                        </div>
                        <EditorTabs
                            input={input}
                            setInput={setInput}
                            output={output}
                            loadingMessage={loadingMessage}
                            shouldSwitchTab={shouldSwitchTab}
                            setShouldSwitchTab={setShouldSwitchTab}
                            testCaseResults={testCaseResults} // Pass testCaseResults to EditorTabs
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemLayout;
