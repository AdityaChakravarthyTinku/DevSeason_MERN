const express = require('express');
const app = express();

const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');


const User = require('../models/User');
const Problem = require('../models/Problem');
const Solution = require('../models/Solution');
const TestCase = require('../models/TestCase');

const {generateFile}= require('../compiler/generateFile');
const {generateInputFile}= require('../compiler/generateInputFile');
const {executeWindows,executeLinux}= require('../compiler/execute');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

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
      const output = await executeWindows(language, filePath, inputFilePath);
      res.send({ filePath, output, inputFilePath });
      console.log(`'\n'+${language}+'\n'+${output}`);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error: ' + err.message, success: false });
    }
  };
  
  exports.updateUserStatsAndProgress = async (userId) => {
    try {
      const solutions = await Solution.find({ userId, verdict: 'AC' });
  
      const totalAttempts = await Solution.countDocuments({ userId });
  
      const problemsSolved = solutions.length;
  
      const progressTracker = {};
  
      for (const solution of solutions) {
        const problem = await Problem.findById(solution.problemId);
  
        if (!problem) {
          continue; // Skip if the problem is not found (should not normally happen)
        }
  
        const { topic, title } = problem;
  
        if (!progressTracker[topic]) {
          progressTracker[topic] = {};
        }
  
        progressTracker[topic][title] = solution._id;
      }
  
      const progressTrackerArray = Object.entries(progressTracker).map(([topicName, problems]) => ({
        topicName,
        problemsSolved: Object.entries(problems).map(([problemTitle, solutionId]) => ({
          problemTitle,
          solutionId,
        })),
      }));
  
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
      let results = []; 
  
      const filePath = await generateFile(language, code);
  

for (const [index, testCase] of testCases.testCases.entries()) {
    const inputFilePath = await generateInputFile(language, testCase.input);
    let result = { testCaseNumber: index + 1, status: 'Passed' };
    
    try {
      const startTime = Date.now();
      //   console.log('Strteddd:::\n\n' + inputFilePath + '\n\n'+filePath +'\n\n'+ testCase)
      const output = await executeWindows(language, filePath, inputFilePath);
      const endTime = Date.now();
      const runtime = endTime - startTime;
      totalRuntime += runtime;
  
      if (!(output.trim() === testCase.output.trim())) {
        console.log(output.trim());
        console.log(testCase.output.trim());
        verdict = 'WA'; // Wrong Answer
        result.status = 'Failed';
        console.log("Running Stopped in this test case");
        results.push(result);
        break;
      }
      console.log("Running test Case Successfully");
    } catch (err) {
      console.error(`Error executing test case: ${err.message}`);
      if (err.message.includes('timeout')) {
        verdict = 'TLE';
      } else if (err.message.includes('memory')) {
        verdict = 'MLE'; 
      } else if (err.message.includes('runtime')) {
        verdict = 'RE';
      } else if (err.message.includes('compile')) {
        verdict = 'CE'; 
      } else {
        verdict = 'RE'; 
      }
      break;
    }
    console.log(result);
    results.push(result);
  }
  
 
  const attemptInterval = 0; // This would be calculated based on a criteria soon
  let penaltyScore = 0; // This would be calculated based on a criteria soon
  

  let solution = await Solution.findOne({ userId, problemId });
  penaltyScore = solution.penaltyScore;
  
  if (solution) {
    // Update the existing solution
    solution.verdict = verdict;
    solution.runtime = totalRuntime;
    solution.language = language;
    solution.attemptInterval = attemptInterval;
    solution.penaltyScore = penaltyScore+1;
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
  
 
  console.log("\n\n" + JSON.stringify(results, null, 2));
  
  res.status(201).json({
    message: 'Solution submitted successfully!',
    success: true,
    testCaseResults: results,
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