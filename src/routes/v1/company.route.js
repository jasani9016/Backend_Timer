const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const catchAsync = require('../../utils/catchAsync');
const { companyDetailsController } = require('../../controllers');
const router = express.Router();

router.post('/updateCompanyDetails',auth(),validate(companyDetailsController.updateCompanyDetails.validation),catchAsync(companyDetailsController.updateCompanyDetails.handler));   // update bank details
router.get('/getCompanyDetails',auth(),catchAsync(companyDetailsController.getCompanyDetails.handler)); 

module.exports = router;
