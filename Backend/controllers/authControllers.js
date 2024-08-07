const express = require('express');
const app = express();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
// const mongoose = require('mongoose');


const User = require('../models/User');




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
      sameSite: 'None',
      secure: true, // Set to true for HTTPS, false for HTTP (during development)
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
      sameSite: 'None',
      secure: true, // Set to true for HTTPS, false for HTTP (during development)
    };
    
    res.status(201).cookie("token", token, options).json({
      message: 'User logged in successfully!',
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
    res.json({ success: true, message: 'Cookie Logged out successfully' });
    console.log('User logged out');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



exports.checkAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ authenticated: false, message: 'Not authenticated' });
    }
    console.log(req.user);
    res.status(200).json({ authenticated: true, user: req.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
