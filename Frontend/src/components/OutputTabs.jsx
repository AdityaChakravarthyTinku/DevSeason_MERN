// EditorTabs.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const EditorTabs = ({ input, setInput, output }) => {
    const [activeTab, setActiveTab] = useState('input'); // Default active tab

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
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        rows="6"
                        value={output}
                        readOnly
                        placeholder="Output"
                    />
                )}
            </div>
        </div>
    );
};

EditorTabs.propTypes = {
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    output: PropTypes.string.isRequired,
};


export default EditorTabs;
