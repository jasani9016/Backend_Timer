const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');
const Leave = require('../models/leave.model');
const moment = require('moment');


const createLeave = {
  validation: {
    body: Joi.object().keys({
      date: Joi.date().required(),
      reason: Joi.string().required(),
      type: Joi.string().valid('full', 'half').required(),
      halfType: Joi.string().when('type', { is: 'half', then: Joi.valid('first', 'second').required() }),
    }),
  },
  handler: async (req, res) => {

    const body = {
      ...req.body,
      user: req.user.id
    }

    const isLeaveOld = moment(body.date).isBefore(moment().startOf('day'));

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
    const results = await Leave.find().populate('user', 'name email').sort({ createdAt: -1 });
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
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const leave = await Leave.findById(id);

    if(req.user.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action');
    }

    if (!leave) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
    }

    leave.status = status;
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
      date: Joi.date(),
      reason: Joi.string(),
      type: Joi.string().valid('full', 'half'),
      halfType: Joi.string().when('type', { is: 'half', then: Joi.valid('first', 'second').required() }),
    }),
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Leave not found');
    }

    if (leave.status !== 'pending') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You can not update leave once it is approved or rejected');
    }

    const isLeaveOld = moment(date).isBefore(moment().startOf('day'));

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