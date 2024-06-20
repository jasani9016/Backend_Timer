const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');
const Leave = require('../models/leave.model');
const moment = require('moment');


const createLeave = {
  validation: {
    body: Joi.object().keys({
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      reason: Joi.string().required(),
      leaveType: Joi.string().valid('full', 'half'),
      halfType: Joi.string().when('type', { is: 'half', then: Joi.valid('first', 'second').required() }),
    }),
  },
  handler: async (req, res) => {

    const body = {
      ...req.body,
      user: req.user.id
    }

    const isLeaveOld = moment(body.startDate).isBefore(moment().startOf('day'));

    if (isLeaveOld) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You can not apply for leave on past dates');
    }

    const result = await new Leave(body).save();

    return res.status(httpStatus.CREATED).send({
      status: 'success',
      message: 'Leave created successfully',
      data: result,
    });
  }
}

const listLeave = catchAsync(async (req, res) => {

  if (req.user.role == 'admin') {

    const { startDate, endDate, status } = req.query;

    const results = await Leave.find(
      {
        ...((startDate && endDate) && { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }),
        ...(status && { status: status }),
      }
    ).populate('user', 'name email').sort({ createdAt: -1 });

    return res.send({
      status: 'success',
      data: results,
    });
  }

  const results = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });

  return res.send({
    status: 'success',
    data: results,
  });
});


const updateLeave = {
  validation: {
    body: Joi.object().keys({
      status: Joi.string().valid('approved', 'rejected').required(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      leaveType: Joi.string().valid('full', 'half'),
      halfType: Joi.string().when('type', { is: 'half', then: Joi.valid('first', 'second').required() }),
      reason: Joi.string(),
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id);

    if (req.user.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action');
    }

    if (!leave) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
    }

    leave.status = status;
    if (req.body?.startDate) leave.startDate = req.body.startDate;
    if (req.body?.endDate) leave.endDate = req.body.endDate;
    if (req.body?.leaveType) leave.leaveType = req.body.leaveType;
    if (req.body?.halfType) leave.halfType = req.body.halfType;
    if (req.body?.reason) leave.reason = req.body.reason;

    await leave.save();

    return res.send({
      status: 'success',
      message: 'Leave updated successfully',
      data: leave,
    });
  }
}


const updateLeaveData = {
  validation: {
    body: Joi.object().keys({
      startDate: Joi.date(),
      endDate: Joi.date(),
      reason: Joi.string(),
      leaveType: Joi.string().valid('full', 'half'),
      halfType: Joi.string().when('type', { is: 'half', then: Joi.valid('first', 'second').required() }),
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;
    const { startDate } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
    }

    if (leave.status !== 'pending') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update leave once it is approved or rejected');
    }

    const isLeaveOld = moment(startDate).isBefore(moment().startOf('day'));

    if (isLeaveOld) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You can not apply for leave on past dates');
    }

    const result = await Leave.findByIdAndUpdate(id, req.body, { new: true });

    return res.send({
      status: 'success',
      message: 'Leave updated successfully',
      data: result,
    });
  }
}



module.exports = {
  createLeave,
  listLeave,
  updateLeave,
  updateLeaveData
};