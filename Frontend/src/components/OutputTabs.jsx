import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EditorTabs = ({ input, setInput, output, loadingMessage, shouldSwitchTab, setShouldSwitchTab, testCaseResults }) => {
    const [activeTab, setActiveTab] = useState('input');

    useEffect(() => {
        if (shouldSwitchTab) {
            const timer = setTimeout(() => {
                setActiveTab('output');
                setShouldSwitchTab(false); // Reset after switching
            }, 1000); // 1-second delay

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [shouldSwitchTab, setShouldSwitchTab]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mt-4">
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => handleTabClick('input')}
                    className={`px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === 'input' ? 'text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-500'}`}
                >
                    Input
                </button>
                <button
                    onClick={() => handleTabClick('output')}
                    className={`px-4 py-2 text-sm font-medium focus:outline-none ${activeTab === 'output' ? 'text-indigo-700 border-b-2 border-indigo-500' : 'text-gray-500'}`}
                >
                    Output
                </button>
            </div>
            <div className="mt-4">
                {activeTab === 'input' && (
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="6"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Input"
                    />
                )}
                {activeTab === 'output' && (
                    <div>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            rows="6"
                            value={loadingMessage ? loadingMessage : output}
                            readOnly
                            placeholder="Output"
                        />
                        {testCaseResults.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {testCaseResults.map((testCase, index) => (
                                    <div
                                        key={index}
                                        className={`px-3 py-1 rounded-md text-white font-semibold ${
                                            testCase.status === 'Passed' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    >
                                        {`Test Case ${index + 1}: ${testCase.status}`}
                                        {/* Optionally display detailed messages */}
                                        {!testCase.passed && testCase.errorMessage && (
                                            <div className="mt-1 text-xs text-gray-200">
                                                {`Error: ${testCase.errorMessage}`}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

EditorTabs.propTypes = {
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    output: PropTypes.string.isRequired,
    loadingMessage: PropTypes.string,
    shouldSwitchTab: PropTypes.bool.isRequired,
    setShouldSwitchTab: PropTypes.func.isRequired,
    testCaseResults: PropTypes.arrayOf(
        PropTypes.shape({
            status: PropTypes.string.isRequired, // 'Passed' or 'Failed'
            errorMessage: PropTypes.string, // Optional field for error messages
        })
    ).isRequired
};

export default EditorTabs;
