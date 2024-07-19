const express = require('express');
const app = express();

const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");



const User = require('../models/User');
const Problem = require('../models/Problem');
const Solution = require('../models/Solution');
const TestCase = require('../models/TestCase');





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

exports.addProblem = async (req, res) => {
    const { ojid, title, topic, difficulty, statement, tutorialLink, codeInput } = req.body;
  
    try {
      // Check if a problem with the same ojid already exists
      let problem = await Problem.findOne({ ojid });
      if (problem) {
        return res.status(400).json({ msg: 'Problem already exists' });
      }
  
      // Create a new Problem instance
      problem = new Problem({
        ojid,
        title,
        topic,
        difficulty,
        statement,
        tutorialLink,
        codeInput  // Ensure codeInput is passed as an array of objects from the frontend
      });
  
      // Save the new problem to the database
      await problem.save();
  
      // Respond with success message and the newly created problem
      res.status(201).json({
        message: 'Problem added successfully!',
        success: true,
        problem,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  
  exports.updateProblem = async (req, res) => {
    const { ojid } = req.params;
    const { title, topic, statement, tutorialLink, codeInput,difficulty } = req.body;
  
    try {
      let problem = await Problem.findOne({ ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      if (title) problem.title = title;
      if (topic) problem.topic = topic;
      if (statement) problem.statement = statement;
      if (tutorialLink) problem.tutorialLink = tutorialLink;
      if (codeInput) problem.codeInput = codeInput;
      if(difficulty) problem.difficulty = difficulty;
  
      await problem.save();
  
      res.status(200).json({
        message: 'Problem updated successfully!',
        success: true,
        problem,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  exports.deleteProblem = async (req, res) => {
    const { ojid } = req.params;
  
    try {
      let problem = await Problem.findOneAndDelete({ ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      res.status(200).json({
        message: 'Problem deleted successfully!',
        success: true,
        problem,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  exports.getProblemByOjid = async (req, res) => {
    try {
      const { ojid } = req.params;
      const problem = await Problem.findOne({ ojid });
  
      if (!problem) {
        return res.status(404).json({ msg: 'No problem found with this Ojid' });
      }
  
      res.status(200).json(problem);
    } catch (error) {
      console.error('Error fetching problem by Ojid:', error);
      res.status(500).json({ msg: 'Failed to fetch problem by Ojid' });
    }
  };
  

  
  exports.getTestCasesByProblemId = async (req, res) => {
    const { ojid } = req.params;
  
    try {
      const problem = await Problem.findOne({ ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      const testCases = await TestCase.findOne({ problemId: problem._id });
  
      if (!testCases) {
        return res.status(404).json({ msg: 'No test cases found for the problem' });
      }
  
      res.json({
        message: 'Test cases fetched successfully!',
        success: true,
        testCases: testCases.testCases,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  exports.addTestCases = async (req, res) => {
    const { ojid } = req.params;
    const { testCases } = req.body;
  
    try {
      const problem = await Problem.findOne({ ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      let existingTestCase = await TestCase.findOne({ problemId: problem._id });
      if (!existingTestCase) {
        existingTestCase = new TestCase({
          problemId: problem._id,
          testCases: [],
        });
      }
  
      existingTestCase.testCases.push(...testCases);
  
      const savedTestCase = await existingTestCase.save();
  
      res.status(201).json({
        message: 'Test cases added successfully!',
        success: true,
        testCases: savedTestCase.testCases,
      });
    } catch (err) {
      console.error('Add Test Cases Error:', err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };
  
  
  exports.updateTestCase = async (req, res) => {
    const { ojid, testCaseId } = req.params;
    const { input, output } = req.body;
  
    try {
      const problem = await Problem.findOne({ ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      const testCaseDoc = await TestCase.findOne({ problemId: problem._id });
      if (!testCaseDoc) {
        return res.status(404).json({ msg: 'No test cases found for the problem' });
      }
  
      const testCase = testCaseDoc.testCases.id(testCaseId);
      if (!testCase) {
        return res.status(404).json({ msg: 'Test case not found' });
      }
  
      testCase.input = input;
      testCase.output = output;
  
      await testCaseDoc.save();
  
      res.json({
        message: 'Test case updated successfully!',
        success: true,
        testCases: testCaseDoc.testCases,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

  exports.deleteTestCase = async (req, res) => {
    const { ojid, testCaseId } = req.params;
  
    try {
      const problem = await Problem.findOne({ ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      const testCaseDoc = await TestCase.findOne({ problemId: problem._id });
      if (!testCaseDoc) {
        return res.status(404).json({ msg: 'No test cases found for the problem' });
      }
  
      // Find the index of the test case to be deleted
      const testCaseIndex = testCaseDoc.testCases.findIndex(tc => tc._id.toString() === testCaseId);
      if (testCaseIndex === -1) {
        return res.status(404).json({ msg: 'Test case not found' });
      }
  
      // Remove the test case from the array
      testCaseDoc.testCases.splice(testCaseIndex, 1);
  
      await testCaseDoc.save();
  
      res.json({
        message: 'Test case deleted successfully!',
        success: true,
        testCases: testCaseDoc.testCases,
      });
    } catch (err) {
      console.error('Delete Test Case Error:', err.message);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };
  