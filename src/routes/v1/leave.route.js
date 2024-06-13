const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const catchAsync = require('../../utils/catchAsync');
const { leaveController } = require('../../controllers');

const router = express.Router();

router.post('/create', auth(), validate(leaveController.createLeave.validation), catchAsync(leaveController.createLeave.handler));
router.get('/list', auth(), leaveController.listLeave);
router.put('/update-status/:id', auth(), validate(leaveController.updateLeave.validation), catchAsync(leaveController.updateLeave.handler));
router.put('/update/:id', auth(), validate(leaveController.updateLeaveData.validation), catchAsync(leaveController.updateLeaveData.handler));




module.exports = router;