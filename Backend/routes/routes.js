const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/controllers');
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminControllers');

router.post(
  '/signup',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 5 or more characters').isLength({ min: 5 }),
  ],
  authController.registerUser
);


router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.loginUser
);


router.post('/logout', authMiddleware, authController.logoutUser);

router.get('/check', authMiddleware, authController.checkAuth);


// Route to add a new problem
router.post(
  '/addproblem',
  adminController.addProblem
);

router.put(
  '/updateproblem/:ojid',
  adminController.updateProblem
);

router.delete('/deleteproblem/:ojid', adminController.deleteProblem);

router.get('/getProblemByOjid/:ojid', adminController.getProblemByOjid);


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

router.post('/addtestCase/:ojid', adminController.addTestCases);

// Route to delete test cases by problemId
router.delete('/deletetestCase/:ojid', adminController.deleteTestCases);

router.get('/testCases/:problemId', authController.getTestCasesByProblemId);


router.post('/run', authController.run);




router.get('/allProblems', authController.getAllProblems);
router.get('/me', authMiddleware, authController.getUserDetails);

// PUT update user details
router.put(
  '/me',
  [
    authMiddleware,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
  ],
  authController.updateUserDetails
);

// router.get('/leaderboard', adminController.getLeaderboard);

// router.get('/submissions', authController.getSubmissions);

// router.get('/submission/:userId/:problemId', authController.getSubmissionByUserIdAndProblemId);

// router.get('/results/:userId/:problemId', authController.getResultsByUserIdAndProblemId);

// router.get('/test/:userId/:problemId/:testCaseId', authController.getTestByUserIdAndProblemIdAndTestCaseId);

// router.get('/results/:userId/:problemId/:testCaseId', authController.getResultsByUserIdAndProblemIdAndTestCaseId);

module.exports = router;
