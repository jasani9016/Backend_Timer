const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const catchAsync = require('../../utils/catchAsync');

const router = express.Router();


// upcomming user birthdate list
router.get('/upcommingUserBirthdate', auth(), userController.upcommingUserBirthdate.handler);

// today user birthdate list
router.get('/todayUserBirthdate', auth(), userController.todayUserBirthdate.handler);

router
  .route('/')
  .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
  .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router.get('/getAllUser', auth(), catchAsync(userController.getAllUser.handler));
router.put('/updateProfile', auth(), validate(userController.updateProfile.validation), catchAsync(userController.updateProfile.handler)); // update personal details 
router.get('/getProfile', auth(), catchAsync(userController.getProfile.handler));   //get personal details

router.put('/updateBankDetails', auth(), validate(userController.updateBankDetails.validation), catchAsync(userController.updateBankDetails.handler));   // update bank details
router.get('/getBankDetails', auth(), catchAsync(userController.getBankDetails.handler));   //get bank details

router.put('/updateCompanyDetails', auth(), validate(userController.updateCompanyDetails.validation), catchAsync(userController.updateCompanyDetails.handler));   // update bank details
router.get('/getCompanyDetails', auth(), catchAsync(userController.getCompanyDetails.handler));   //get bank details

router
  .route('/:userId')
  .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
