const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');
// const { saveFile } = require('../utils/helper');
const { Time } = require('../models');
const { ObjectId } = require('mongodb');
const { objectId } = require('../validations/custom.validation');
const moment = require('moment');


const createTimeManagment = {
  validation: {
    body: Joi.object().keys({
      projectName: Joi.string().required(),
      taskTitle: Joi.string().required(),
      // startTime: Joi.string(),
    }),
  },
  handler: async (req, res) => {
    // const endTime = new Date(Date.now() + 6 * 6 * 100);

    const body = {
      ...req.body,
      startTime: new Date(),
      user: req.user.id
    }

    const result = await new Time(body).save();
    return res.status(httpStatus.CREATED).send(result);
  }
}


const getTimeManagment = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  let results;

  if (startDate && endDate) {
    results = await Time.aggregate(
      [
        {
          $match: {
            user: ObjectId(req.user.id),
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate)
            }
          }
        }
      ],
    );
  } else {
    results = await Time.find({ user: req.user.id });
  }

  return res.status(httpStatus.OK).send({ results });
});

// const getAllTimeManagement = catchAsync(async (req, res) => {
//   const time = await Time.find();
//   return res.status(httpStatus.OK).send({ time });

// })

const getAllTimeManagement = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  let time;

  if (startDate && endDate) {
    time = await Time.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: new Date(startDate),
              $lt: new Date(endDate)
            }
          }
        }
      ],
    );
  } else {
    time = await Time.find();
  }

  return res.status(httpStatus.OK).send({ time });
});

const updateTimeManagment = {
  validation: {
    params: Joi.object().keys({
      id: Joi.string(),
    }),
  },
  handler: catchAsync(async (req, res) => {
    const timeData = await Time.findById(req.params.id);
    if (!timeData) {
      throw new ApiError(httpStatus.NOT_FOUND, 'not found');
    }

    const startTime = moment(timeData.startTime);
    const endTime = moment(new Date());

    const duration = moment.duration(endTime.diff(startTime));

    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    const elapsedTime = `${hours}:${minutes}:${seconds}`;

    timeData.elapsedTime = elapsedTime;
    timeData.endTime = endTime;

    const result = await timeData.save();

    return res.status(httpStatus.OK).send({ message: 'Record updated successfully', result });
  })
}


module.exports = {
  createTimeManagment,
  getTimeManagment,
  updateTimeManagment,
  getAllTimeManagement
};