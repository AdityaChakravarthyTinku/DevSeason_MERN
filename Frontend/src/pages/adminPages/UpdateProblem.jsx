import { useState, useContext } from 'react';
import { fetchProblemByOjid } from '../../api'; // Adjust path as per your file structure
import { ProblemContext } from '../../context/ProblemContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProblemForm = () => {
    const { updateProblemById } = useContext(ProblemContext);
    const [formData, setFormData] = useState({
        ojid: '',
        title: '',
        topic: '',
        statement: '',
        tutorialLink: '',
        codeInputs: [{ language: '', template: '' }],
        difficulty: '',
    });
    const [error, setError] = useState(null);

    const handleOjidChange = async (e) => {
        const ojid = e.target.value;
        try {
            const data = await fetchProblemByOjid(ojid);
            setFormData({
                ojid,
                title: data.title,
                topic: data.topic,
                statement: data.statement,
                tutorialLink: data.tutorialLink,
                codeInputs: data.codeInput.map(input => ({ language: input.language, template: input.template })),
                difficulty: data.difficulty,
            });
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching problem details:', error);
            setFormData({
                ojid,
                title: '',
                topic: '',
                statement: '',
                tutorialLink: '',
                codeInputs: [{ language: '', template: '' }],
                difficulty: '',
            });
            setError('Problem not found for this Ojid.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('codeInput')) {
            const index = parseInt(name.split('[')[1].split(']')[0], 10);
            const field = name.split('.')[1];
            const codeInputs = [...formData.codeInputs];
            codeInputs[index] = { ...codeInputs[index], [field]: value };
            setFormData({ ...formData, codeInputs });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddCodeInput = () => {
        setFormData({
            ...formData,
            codeInputs: [...formData.codeInputs, { language: '', template: '' }]
        });
    };

    const handleRemoveCodeInput = (index) => {
        const codeInputs = [...formData.codeInputs];
        codeInputs.splice(index, 1);
        setFormData({ ...formData, codeInputs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { ojid, title, topic, statement, tutorialLink, codeInputs, difficulty } = formData;
            const updatedProblem = { title, topic, statement, tutorialLink, codeInput: codeInputs.map(input => ({ language: input.language, template: input.template })), difficulty };
            console.log('Submitting updated problem:', updatedProblem);
            await updateProblemById(ojid, updatedProblem);
            console.log('Problem updated successfully.');
            toast.success('Problem updated successfully.');
        } catch (error) {
            console.error('Error updating problem:', error);
            toast.error('Problem not updated.');
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="max-w-3xl mx-auto p-6 bg-purple-50 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Update Problem</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="ojid" className="block text-sm font-medium text-purple-700">
                            Ojid
                        </label>
                        <input
                            type="text"
                            id="ojid"
                            name="ojid"
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.ojid}
                            onChange={handleOjidChange}
                            required
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-purple-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="topic" className="block text-sm font-medium text-purple-700">
                            Topic
                        </label>
                        <input
                            type="text"
                            id="topic"
                            name="topic"
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.topic}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="statement" className="block text-sm font-medium text-purple-700">
                            Problem Statement
                        </label>
                        <textarea
                            id="statement"
                            name="statement"
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.statement}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tutorialLink" className="block text-sm font-medium text-purple-700">
                            Tutorial Link
                        </label>
                        <input
                            type="text"
                            id="tutorialLink"
                            name="tutorialLink"
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={formData.tutorialLink}
                            onChange={handleChange}
                        />
                    </div>
                    {formData.codeInputs.map((input, index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={`codeInput[${index}].language`} className="block text-sm font-medium text-purple-700">
                                Code Language
                            </label>
                            <input
                                type="text"
                                id={`codeInput[${index}].language`}
                                name={`codeInput[${index}].language`}
                                className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={input.language}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor={`codeInput[${index}].template`} className="block text-sm font-medium text-purple-700 mt-2">
                                Code Template
                            </label>
                            <textarea
                                id={`codeInput[${index}].template`}
                                name={`codeInput[${index}].template`}
                                className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                value={input.template}
                                onChange={handleChange}
                                rows="4"
                                required
                            ></textarea>
                            <button
                                type="button"
                                onClick={() => handleRemoveCodeInput(index)}
                                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Remove Code Input
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddCodeInput}
                        className="mb-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Add Code Input
                    </button>
                    <div className="mb-4">
                        <label htmlFor="difficulty" className="block text-sm font-medium text-purple-700">
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            required
                        >
                            <option value="">Select Difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Update Problem
                    </button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};

export default UpdateProblemForm;
