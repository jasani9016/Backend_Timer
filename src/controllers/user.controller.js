const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { User } = require('../models');
const Joi = require('joi');
const { email } = require('../config/config');
const { saveFile } = require('../utils/helper');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getAllUser = {
  handler: async (req, res) => {
    const user = await User.find();
    return res.status(httpStatus.OK).send(user)
  }
}

const updateProfile = {
  validation: {
    body: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      address: Joi.string(),
      contactNo: Joi.string(),
      birthDate: Joi.date(),
      gender: Joi.string(),
      email: Joi.string(),
      profileImage: Joi.string(),
    })
  },
  handler: async (req, res) => {

    if (req.files && req.files?.profileImage) {
      const { upload_path } = await saveFile(req.files?.profileImage);
      req.body.profileImage = upload_path;
    }

    const user = await userService.updateUserById(req.user._id, req.body)
    return res.status(httpStatus.OK).send({ message: "Profile Update Successfully", user });
  }
}

const getProfile = {
  handler: async (req, res) => {
    const user = await userService.getUserById(req.user._id);
    return res.send(user);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllUser,
  updateProfile,
  getProfile
};



 