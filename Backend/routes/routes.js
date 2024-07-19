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


router.get('/testcases/:ojid', adminController.getTestCasesByProblemId);
router.post('/testcases/:ojid', adminController.addTestCases);
router.put('/testcases/:ojid/:testCaseId', adminController.updateTestCase);
router.delete('/testcases/:ojid/:testCaseId', adminController.deleteTestCase);


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

router.put('/update-stats-and-progress/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await authController.updateUserStatsAndProgress(userId);
    res.status(200).json({ message: 'User stats and progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user stats and progress' });
  }
});

router.get('/leaderboard/:ojid', authController.getProblemLeaderboard);

// router.get('/leaderboard', adminController.getLeaderboard);

// router.get('/submissions', authController.getSubmissions);

// router.get('/submission/:userId/:problemId', authController.getSubmissionByUserIdAndProblemId);

// router.get('/results/:userId/:problemId', authController.getResultsByUserIdAndProblemId);

// router.get('/test/:userId/:problemId/:testCaseId', authController.getTestByUserIdAndProblemIdAndTestCaseId);

// router.get('/results/:userId/:problemId/:testCaseId', authController.getResultsByUserIdAndProblemIdAndTestCaseId);

module.exports = router;
