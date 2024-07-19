const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controller = require('../controllers/controllers');
const authController = require('../controllers/authControllers.js');
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminControllers');
const compilerController = require('../controllers/compilerControllers');

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
  compilerController.submitSolution
);

// Route to fetch a solution by user ID and problem ID
router.get('/fetch/:userId/:problemId', controller.getIndividualSolution);


router.get('/testcases/:ojid', adminController.getTestCasesByProblemId);
router.post('/testcases/:ojid', adminController.addTestCases);
router.put('/testcases/:ojid/:testCaseId', adminController.updateTestCase);
router.delete('/testcases/:ojid/:testCaseId', adminController.deleteTestCase);


router.post('/run', compilerController.run);

router.get('/submissions', authMiddleware, controller.getUserSubmissions); // Modified route
router.get('/problem/:problemId/', authMiddleware, controller.getProblem);



router.get('/allProblems', controller.getAllProblems);

router.get('/allUsers', controller.getAllUsers);
router.get('/allSubmissions', controller.getAllSubmissions);


router.delete('/deleteUser/:userId', controller.deleteUser);

router.get('/me', authMiddleware, controller.getUserDetails);

// PUT update user details
router.put(
  '/me',
  [
    authMiddleware,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
  ],
  controller.updateUserDetails
);

router.put('/update-stats-and-progress/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    await compilerController.updateUserStatsAndProgress(userId);
    res.status(200).json({ message: 'User stats and progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user stats and progress' });
  }
});

router.get('/leaderboard/:ojid', controller.getProblemLeaderboard);

// router.get('/leaderboard', adminController.getLeaderboard);

// router.get('/submissions', controller.getSubmissions);

// router.get('/submission/:userId/:problemId', controller.getSubmissionByUserIdAndProblemId);

// router.get('/results/:userId/:problemId', controller.getResultsByUserIdAndProblemId);

// router.get('/test/:userId/:problemId/:testCaseId', controller.getTestByUserIdAndProblemIdAndTestCaseId);

// router.get('/results/:userId/:problemId/:testCaseId', controller.getResultsByUserIdAndProblemIdAndTestCaseId);

module.exports = router;
