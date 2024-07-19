import { useState, useContext } from 'react';
import { ProblemContext } from '../../context/ProblemContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';

const AddProblemForm = () => {
    const { addProblem } = useContext(ProblemContext);
    const [formData, setFormData] = useState({
        ojid: '',
        title: '',
        topic: '',
        statement: '',
        tutorialLink: '',
        codeInputs: [{ language: '', template: '' }],
        difficulty: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('codeInput')) {
            const index = parseInt(name.split('.')[1]);
            const codeInputs = [...formData.codeInputs];
            codeInputs[index] = { ...codeInputs[index], [name.split('.')[2]]: value };
            setFormData({ ...formData, codeInputs });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddCodeInput = () => {
        setFormData({ ...formData, codeInputs: [...formData.codeInputs, { language: '', template: '' }] });
    };

    const handleRemoveCodeInput = (index) => {
        const updatedCodeInputs = formData.codeInputs.filter((_, idx) => idx !== index);
        setFormData({ ...formData, codeInputs: updatedCodeInputs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problemData = {
            ...formData,
            codeInput: formData.codeInputs.map(input => ({ language: input.language, template: input.template })),
        };
        delete problemData.codeInputs; // Remove temporary codeInputs
        console.log('Submitting Problem Data:', problemData);
        try {
            await addProblem(problemData);
            toast.success('Problem added successfully!');
            setFormData({
                ojid: '',
                title: '',
                topic: '',
                statement: '',
                tutorialLink: '',
                codeInputs: [{ language: '', template: '' }],
                difficulty: '',
            });
            navigate(`/addtestcase/${formData.ojid}`);
        } catch (error) {
            console.error('Error adding problem:', error);
            toast.error('Failed to add problem.');
        }
    };

    return (
        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="max-w-3xl mx-auto p-6 bg-purple-50  rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-purple-700">Add Problem</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="ojid" className="block text-sm font-medium text-purple-700">
                        Local Problem ID
                    </label>
                    <input
                        type="text"
                        id="ojid"
                        name="ojid"
                        className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        value={formData.ojid}
                        onChange={handleChange}
                        required
                    />
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
                {formData.codeInputs.map((input, index) => (
                    <div key={index} className="mb-4">
                        <label htmlFor={`codeInput.${index}.language`} className="block text-sm font-medium text-purple-700">
                            Code Language
                        </label>
                        <input
                            type="text"
                            id={`codeInput.${index}.language`}
                            name={`codeInput.${index}.language`}
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={input.language}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor={`codeInput.${index}.template`} className="block text-sm font-medium text-purple-700 mt-2">
                            Code Template
                        </label>
                        <textarea
                            id={`codeInput.${index}..template`}
                            name={`codeInput.${index}.template`}
                            className="mt-1 block w-full px-4 py-2 rounded-md shadow-md border border-purple-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={input.template}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => handleRemoveCodeInput(index)}
                                className="text-red-600 hover:text-red-800 transition duration-300"
                            >
                                <MinusCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={handleAddCodeInput}
                        className="text-green-600 hover:text-green-800 transition duration-300"
                    >
                        <PlusCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Proceed
                    </button>
                </div>
            </form>
            <ToastContainer />
        </div>
        </div>
    );
};

export default AddProblemForm;
