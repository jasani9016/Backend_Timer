const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const Joi = require('joi');
// const { saveFile } = require('../utils/helper');
const { Time } = require('../models');
const { ObjectId } = require('mongodb');
const { objectId } = require('../validations/custom.validation');


const createTimeManagment = {
  validation: {
    body: Joi.object().keys({
      projectName: Joi.string().required(),
      taskTitle: Joi.string().required(),
      // startTime: Joi.string(),
    }),
  },
  handler: async (req, res) => {
    const startTime = new Date();
    // const endTime = new Date(Date.now() + 6 * 6 * 100);

    const body = {
      ...req.body,
      startTime,
      // endTime,
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
    const festivals = await Time.findById(req.params.id);
    if (!festivals) {
      throw new ApiError(httpStatus.NOT_FOUND, 'not found');
    }
    const endTime = new Date();
    const startTime = new Date(festivals.startTime);
    const formatedTime = formateTime(endTime, startTime);
    festivals.endTime = endTime;
    festivals.elapsedTime = formatedTime;
    // console.log('formateTime', formateTime)
    // Update the end time and elapsed time

    const result = await festivals.save();

    return res.status(httpStatus.OK).send({ message: 'Record updated successfully', result, formateTime });
  })
}

const formateTime = (endTime, startTime) => {


  const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
  const hours = Math.floor(elapsedTimeInSeconds / 3600);
  const minutes = Math.floor((elapsedTimeInSeconds % 3600) / 60);
  const seconds = elapsedTimeInSeconds % 60;
  // const sum = [1,5,6].reduce(add, 0);
  // function add(t1, t2) {
  //   return t1 + t2
  // }
  // console.log('sum', sum)
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

const padZero = (num) => {
  // return num.toString().padStart(2, '0');
  return num < 10 ? `0${num}` : num;

};

module.exports = {
  createTimeManagment,
  getTimeManagment,
  updateTimeManagment,
  getAllTimeManagement
};