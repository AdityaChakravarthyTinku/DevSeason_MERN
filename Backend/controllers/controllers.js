const express = require('express');
const app = express();

const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');


const User = require('../models/User');
const Problem = require('../models/Problem');
const Solution = require('../models/Solution');
const TestCase = require('../models/TestCase');




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
dotenv.config();

//Get Details

//
exports.getIndividualSolution = async (req, res) => {
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
  try {
    const userId = req.user._id; // Get user ID from JWT token
    const submissions = await Solution.find({ userId });
    res.status(200).json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProblem = async (req, res) => {
  const { problemId } = req.params;
  try {
    const problem = await Problem.find({ problemId });
    res.status(200).json(problem);
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
    const submissions = await Solution.find({ problemId: problem._id, verdict: 'AC' }) // Filter by verdict
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
        language: submission.language || 'Setup not done',
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


//Profile Controllers

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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Solution.find({});
    res.status(200).json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};