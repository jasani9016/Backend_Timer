const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { dailySummaryController } = require('../../controllers');

const router = express.Router();

router.post('/create-dailysummary',auth(), validate(dailySummaryController.createDailySummaryManagment.validation), catchAsync(dailySummaryController.createDailySummaryManagment.handler));
router.get('/get-dailysummaryId', auth(), catchAsync(dailySummaryController.getDailySummaryManagmentById.handler));
// router.get('/getAllTime',  catchAsync(timeController.getAllTimeManagement));

// router.put('/:_id', auth(), validate(festivalsFrameController.updateFestivalsFrame.validation), catchAsync(festivalsFrameController.updateFestivalsFrame.handler));



module.exports = router;