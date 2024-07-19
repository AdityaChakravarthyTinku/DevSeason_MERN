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
    setTimeout(()=> {
      console.log('Logging and redirecting to home via timeout');
      res.redirect('/');
    },2000)
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




// Add this function for fetching test cases by problemId (using ojid)



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

exports.updateUserStatsAndProgress = async (userId) => {
  try {
    // Fetch all AC (Accepted) solutions by the user
    const solutions = await Solution.find({ userId, verdict: 'AC' });

    // Calculate total attempts (including non-AC solutions)
    const totalAttempts = await Solution.countDocuments({ userId });

    // Calculate problems solved
    const problemsSolved = solutions.length;

    // Initialize progress tracker
    const progressTracker = {};

    // Loop through each solution and fetch corresponding problem details
    for (const solution of solutions) {
      const problem = await Problem.findById(solution.problemId);

      if (!problem) {
        continue; // Skip if the problem is not found (should not normally happen)
      }

      const { topic, title } = problem;

      if (!progressTracker[topic]) {
        progressTracker[topic] = {};
      }

      progressTracker[topic][title] = solution._id; // Store solution ID
    }

    // Convert progress tracker to the desired format
    const progressTrackerArray = Object.entries(progressTracker).map(([topicName, problems]) => ({
      topicName,
      problemsSolved: Object.entries(problems).map(([problemTitle, solutionId]) => ({
        problemTitle,
        solutionId,
      })),
    }));

    // Update user stats and progress in the database
    await User.findByIdAndUpdate(userId, {
      'profile.stats.problemsSolved': problemsSolved,
      'profile.stats.totalAttempts': totalAttempts,
      'profile.progressTracker': progressTrackerArray,
    });

    console.log('User stats and progress updated successfully');
  } catch (error) {
    console.error('Error updating user stats and progress:', error);
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
    // console.log(`Fetching test cases for problemId: ${problem._id}`);
    const testCases = await TestCase.findOne({ problemId: problem._id.toString() });
    // console.log(`Retrieved test cases: ${testCases}`);
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
        console.log('Strteddd:::\n\n' + inputFilePath + '\n\n'+filePath +'\n\n'+ testCase)
        const output = await execute(language, filePath, inputFilePath);
        const endTime = Date.now();
        const runtime = endTime - startTime;
        totalRuntime += runtime;

        if (!(output.trim() === testCase.output.trim())) {
          console.log(output.trim());
          console.log(testCase.output.trim());
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
      solution.language = language;
      solution.attemptInterval = attemptInterval;
      solution.penaltyScore = penaltyScore;
      solution.submittedTime = Date.now();
    } else {
      // Create a new solution
      solution = new Solution({
        userId,
        problemId,
        language,
        verdict,
        runtime: totalRuntime,
        attemptInterval,
        penaltyScore
      });
    }

    await solution.save();

    await exports.updateUserStatsAndProgress(userId);


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

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve problems' });
  }
};


exports.getUserSubmissions = async (req, res) => {
  const { userId } = req.params;
  try {
    const submissions = await Solution.find({ userId });
    res.status(200).json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProblemSubmissions = async (req, res) => {
  const { problemId } = req.params;
  try {
    const submissions = await Solution.find({ problemId });
    res.status(200).json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProblemLeaderboard = async (req, res) => {
  const { ojid } = req.params;
  try {
    // Retrieve the problem by ojid
    const problem = await Problem.findOne({ ojid });
    if (!problem) {
      return res.status(404).json({ msg: 'Problem not found' });
    }

    // Get the solutions for the problem _id
    const submissions = await Solution.find({ problemId: problem._id })
      .sort({ runtime: 1, penaltyScore: 1 }) // Sort by runtime and penaltyScore
      .populate('userId', 'name email'); // Populate user details

    // Map to leaderboard format
    const leaderboard = submissions.map(submission => {
      if (!submission.userId) {
        console.error(`Missing userId for submission with id: ${submission._id}`);
        return null;
      }
      return {
        userName: submission.userId.name,
        userEmail: submission.userId.email,
        language: submission.language|| 'Setup not done',
        runtime: submission.runtime,
        penaltyScore: submission.penaltyScore,
        submittedTime: submission.submittedTime
      };
    }).filter(entry => entry !== null);

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUserDetails = async (req, res) => {
  const { name, email, bio } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (bio) userFields['profile.bio'] = bio;

  try {
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: userFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

