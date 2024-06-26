const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address:{
      type:String,
    },
    contactNo: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/) || !value.match(/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/) || !value.match(/[A-Z]/)) {
      //     throw new Error('Password must contain at least one letter, one number and one special character');
      //   }
      // },
      private: true, // used by the toJSON plugin
    },
    totalLeave : {
      type: Number,
    },
    leaveCount: {
      type: Number,
      default: 0,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    branchNumber: {
      type: String,
    },
    streetAddress: {
      type: String,
    },
    city: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    region: {
      type: String,
    },
    country: {
      type: String,
    },
    bankAccounType: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyAddress: {
      type: String,
    },
    ifscCode: {
      type: String,
    },
    stafId: {
      type: String,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    profileUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
