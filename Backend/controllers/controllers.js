const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');


const User = require('../models/User');
const Problem = require('../models/Problem');
const Solution = require('../models/Solution');
const TestCase = require('../models/TestCase');

const {generateFile}= require('../compiler/generateFile');
const {generateInputFile}= require('../compiler/generateInputFile');
const {execute}= require('../compiler/execute');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log(user);
    console.log(user._id);

    const payload = {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const options = {
      expires: new Date(Date.now() + 3600000), // 1 hour
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      message: 'User registered successfully!',
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, admin_SecurityKey } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: 'User Not Found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Password!' });
    }

    if (user.role === 'admin' && user.admin_SecurityKey !== admin_SecurityKey) {
      return res.status(401).json({ msg: 'You are an Admin Bro Log in Through Admin portal login Or Else Check Security Key!' });
    }

    const payload = {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const options = {
      expires: new Date(Date.now() + 3600000), // 1 hour
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      message: 'You have logged in successfully!',
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully' });
    console.log('User logged out');
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.checkAuth = async (req, res) => {
  try {
    res.status(200).json({ authenticated: true, user: req.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


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

// Add this function for fetching test cases by problemId (using ojid)
exports.getTestCasesByProblemId = async (req, res) => {
  const { problemId } = req.params;

  try {
    const problem = await Problem.findOne({ problemId });
    if (!problem) {
      return res.status(404).json({ msg: 'Problem not found' });
    }

    const testCase = await TestCase.findOne({ problemId: problem._id });

    if (!testCase) {
      return res.status(404).json({ msg: 'No test cases found for the problem' });
    }

    res.json({
      message: 'Test cases fetched successfully!',
      success: true,
      testCases: testCase.testCases,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.run = async (req, res) => {
  console.log('Running the code begins...');
  const { language, code, input } = req.body;

  if (!code) {
    return res.status(400).json({ msg: 'Empty code', success: false });
  }


  console.log(`${language}+'\n'+${code}+'\n'+${input}`);

  try {
    const filePath = await generateFile(language, code);
    const inputFilePath = await generateInputFile(language, input||'N/A');
    const output = await execute(language, filePath, inputFilePath);
    res.send({ filePath, output, inputFilePath });
    console.log(`'\n'+${language}+'\n'+${output}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error: ' + err.message, success: false });
  }
};



exports.submitSolution = async (req, res) => {
  const { userId, problemId, language, code } = req.body;

  if (!code) {
    return res.status(400).json({ msg: 'Empty code', success: false });
  }

  try {
    // Validate and convert problemId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ msg: 'Invalid problem ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }

    // Check if the problem exists
    const problem = await Problem.findById(problemId);
    console.log(problem._id);
    console.log(problem.ojid);
    if (!problem) {
      return res.status(404).json({ msg: 'Problem not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch the test cases for the problem
    console.log(`Fetching test cases for problemId: ${problem._id}`);
    const testCases = await TestCase.findOne({ problemId: problem._id.toString() });
    console.log(`Retrieved test cases: ${testCases}`);
    if (!testCases || testCases.testCases.length === 0) {
      return res.status(404).json({ msg: 'No test cases found for the problem' });
    }

    let verdict = 'AC'; // Assume "Accepted" unless a test case fails
    let totalRuntime = 0;

    // Create a file for the user's code
    const filePath = await generateFile(language, code);

    // Execute the user's code for each test case
    for (const testCase of testCases.testCases) {
      const inputFilePath = await generateInputFile(language, testCase.input);
      
      try {
        const startTime = Date.now();
        const output = await execute(language, filePath, inputFilePath);
        const endTime = Date.now();
        const runtime = endTime - startTime;
        totalRuntime += runtime;

        if (!(output.trim() === testCase.output.trim())) {
          verdict = 'WA'; // Wrong Answer
          console.log("Running Stopped in this test case");
          break;
        }
        console.log("Running test Case Successfully");
      } catch (err) {
        console.error(`Error executing test case: ${err.message}`);
        if (err.message.includes('timeout')) {
          verdict = 'TLE'; // Time Limit Exceeded
        } else if (err.message.includes('memory')) {
          verdict = 'MLE'; // Memory Limit Exceeded
        } else if (err.message.includes('output')) {
          verdict = 'OLE'; // Output Limit Exceeded
        } else if (err.message.includes('runtime')) {
          verdict = 'RE'; // Runtime Error
        } else if (err.message.includes('compile')) {
          verdict = 'CE'; // Compilation Error
        } else {
          verdict = 'RE'; // Default to Runtime Error for any other errors
        }
        break;
      }
    }

    // Calculate the attempt interval and penalty score
    const attemptInterval = 0; // This would be calculated based on your criteria
    const penaltyScore = 0; // This would be calculated based on your criteria

    // Check if the solution already exists for the user and problem
    let solution = await Solution.findOne({ userId, problemId });

    if (solution) {
      // Update the existing solution
      solution.verdict = verdict;
      solution.runtime = totalRuntime;
      solution.attemptInterval = attemptInterval;
      solution.penaltyScore = penaltyScore;
      solution.submittedTime = Date.now();
    } else {
      // Create a new solution
      solution = new Solution({
        userId,
        problemId,
        verdict,
        runtime: totalRuntime,
        attemptInterval,
        penaltyScore
      });
    }

    await solution.save();

    res.status(201).json({
      message: 'Solution submitted successfully!',
      success: true,
      solution,
    });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.userId && err.keyPattern.problemId) {
      return res.status(400).json({ msg: 'Duplicate solution entry for user and problem' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getSolution = async (req, res) => {
  const { userId, problemId } = req.params;

  try {
    const solution = await Solution.findOne({ userId, problemId }).populate('problemId');
    if (!solution) {
      return res.status(404).json({ msg: 'Solution not found' });
    }

    res.status(200).json({
      success: true,
      solution,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
