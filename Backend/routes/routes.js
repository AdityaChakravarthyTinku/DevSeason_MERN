const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/controllers');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 5 or more characters').isLength({ min: 5 }),
  ],
  authController.registerUser
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.loginUser
);


// Logout route
router.post('/logout', authMiddleware.auth, authController.logoutUser);

// Check authentication route
router.get('/check', authMiddleware.auth, authController.checkAuth);

// Route to add a new problem
router.post(
  '/addproblem',
  authController.addProblem
);

router.put(
  '/updateproblem/:ojid',
  authController.updateProblem
);

router.delete('/deleteproblem/:ojid', authController.deleteProblem);

router.get('/getProblemByOjid/:ojid', authController.getProblemByOjid);


router.post(
  '/submit',
  [
    check('userId', 'User ID is required').not().isEmpty(),
    check('problemId', 'Problem ID is required').not().isEmpty(),
  ],
  authController.submitSolution
);

// Route to fetch a solution by user ID and problem ID
router.get('/fetch/:userId/:problemId', authController.getSolution);

router.post('/addtestCase/:ojid', authController.addTestCases);

// Route to delete test cases by problemId
router.delete('/deletetestCase/:ojid', authController.deleteTestCases);

router.get('/testCases/:problemId', authController.getTestCasesByProblemId);


router.post('/run', authController.run);

module.exports = router;
