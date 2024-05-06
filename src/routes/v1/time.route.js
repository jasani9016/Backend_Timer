const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { timeController } = require('../../controllers');

const router = express.Router();

router.post('/create',auth(), validate(timeController.createTimeManagment.validation), catchAsync(timeController.createTimeManagment.handler));
router.put('/update/:id',auth(), validate(timeController.updateTimeManagment.validation), catchAsync(timeController.updateTimeManagment.handler));
router.get('/get', auth(), catchAsync(timeController.getTimeManagment));
router.get('/getAllTime',  catchAsync(timeController.getAllTimeManagement));
// router.put('/:_id', auth(), validate(festivalsFrameController.updateFestivalsFrame.validation), catchAsync(festivalsFrameController.updateFestivalsFrame.handler));



module.exports = router;