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
  
  
  
  exports.addTestCases = async (req, res) => {
    const { ojid } = req.params;
    const { testCases } = req.body;
  
    try {
      const problem = await Problem.findOne({ ojid: ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      const existingTestCase = await TestCase.findOne({ problemId: problem._id });
      if (existingTestCase) {
        return res.status(400).json({ msg: 'Test cases for this problem already exist' });
      }
  
      // Create test case document
      const newTestCase = new TestCase({
        problemId: problem._id,
        testCases,
      });
  
      // Save the test case into the database
      const createdTestCase = await newTestCase.save();
  
      res.status(201).json({
        message: 'Test cases added successfully!',
        success: true,
        testCase: createdTestCase,
      });
    
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  exports.deleteTestCases = async (req, res) => {
    const { ojid } = req.params;
  
    try {
      const problem = await Problem.findOne({ ojid: ojid });
      if (!problem) {
        return res.status(404).json({ msg: 'Problem not found' });
      }
  
      // Delete the test case for the given problemId
      const deletedTestCase = await TestCase.findOneAndDelete({ problemId: problem._id });
  
      if (!deletedTestCase) {
        return res.status(404).json({ msg: 'No test cases found for the problem' });
      }
  
      res.json({
        message: 'Test cases deleted successfully!',
        success: true,
        deletedTestCase,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };