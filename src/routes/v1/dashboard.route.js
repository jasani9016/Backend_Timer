const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { dashboardController } = require('../../controllers');

const router = express.Router();

router.get('/get', auth(), catchAsync(dashboardController.getDashboard.handler));






module.exports = router;