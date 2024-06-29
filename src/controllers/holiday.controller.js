const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Joi = require('joi');
const { Holiday } = require('../models');


const createHoliday = {
  validation: {
    body: Joi.object().keys({
      name: Joi.string().trim().required(),
      date: Joi.date().required(),
      description: Joi.string().allow('')
    }),
  },
  handler: async (req, res) => {

    const { name } = req.body;

    const holidayExist = await Holiday.findOne({ name });

    if (holidayExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Holiday already exist');
    }

    const holiday = await Holiday.create(req.body);

    res.status(httpStatus.CREATED).send(holiday);
  }
}


const getAllHoliday = {
  handler: async (req, res) => {
    const holidays = await Holiday.find();
    res.send(holidays);
  }
}

const updateHoliday = {
  validation: {
    body: Joi.object().keys({
      name: Joi.string().trim().required(),
      date: Joi.date().required(),
      description: Joi.string().allow('')
    }),
  },
  handler: async (req, res) => {

    const { _id } = req.params;

    const holidayExist = await Holiday.findOne({ _id });

    if (!holidayExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Holiday not exist');
    }

    if (req.body?.name) {
      const holidayExist = await Holiday.findOne({ name: req.body.name, _id: { $ne: _id } });
      if (holidayExist) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Holiday already exist');
      }
    }

    const holiday = await Holiday.findByIdAndUpdate(_id, req.body, { new: true });

    res.send(holiday);
  }

}


const deleteHoliday = {
  handler: async (req, res) => {
    const { _id } = req.params;

    const holidayExist = await Holiday.findOne({ _id });

    if (!holidayExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Holiday not exist');
    }

    await Holiday.findByIdAndDelete(_id);

    res.send({ message: 'Holiday deleted successfully' });
  }
}


const getHolidayList = {
  handler: async (req, res) => {

    const holidays = await Holiday.aggregate([
      {
        $sort: { date: 1 }
      },
      {
        $project: {
          month: { $month: '$date' },
          name: 1,
          date: 1,
          description: 1
        }
      },
      {
        $group: {
          _id: '$month',
          holidays: {
            $push: {
              name: '$name',
              date: '$date',
              description: '$description'
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 1] }, then: 'January' },
                { case: { $eq: ['$_id', 2] }, then: 'February' },
                { case: { $eq: ['$_id', 3] }, then: 'March' },
                { case: { $eq: ['$_id', 4] }, then: 'April' },
                { case: { $eq: ['$_id', 5] }, then: 'May' },
                { case: { $eq: ['$_id', 6] }, then: 'June' },
                { case: { $eq: ['$_id', 7] }, then: 'July' },
                { case: { $eq: ['$_id', 8] }, then: 'August' },
                { case: { $eq: ['$_id', 9] }, then: 'September' },
                { case: { $eq: ['$_id', 10] }, then: 'October' },
                { case: { $eq: ['$_id', 11] }, then: 'November' },
                { case: { $eq: ['$_id', 12] }, then: 'December' }
              ],
              default: 'Invalid month'
            }
          },
          holidays: 1
        }
      },
    ]);

    res.send(holidays);
  }
}







module.exports = {
  createHoliday,
  getAllHoliday,
  updateHoliday,
  deleteHoliday,
  getHolidayList
};