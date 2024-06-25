const httpStatus = require('http-status');
const { Holiday, User } = require('../models');


const getDashboard = {
  handler: async (req, res) => {

    // find current month holidays and not include which has already passed
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();
    const holidays = await Holiday.aggregate([
      {
        $project: {
          name: 1,
          date: 1,
          month: { $month: '$date' },
          year: { $year: '$date' },
          day: { $dayOfMonth: '$date' },
        },
      },
      {
        $match: {
          month: currentMonth + 1,
          year: currentYear,
          day: { $gte: currentDay },
        },
      },
    ]);


    const user = await User.findById(req.user.id);

    // upcoming birthday and this month birthday of employees 
    const employees = await User.aggregate([
      {
        $match: {
          role: 'user',
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          birthDate: 1,
          month: { $month: '$birthDate' },
          day: { $dayOfMonth: '$birthDate' },
        },
      },
      {
        $match: {
          month: currentMonth + 1,
          day: { $gte: currentDay },
        },
      },
    ]);


    const result = {
      totalHolidays: holidays.length,
      totalUsedLeaves: user.leaveCount,
      totalLeave : user.totalLeave,
      upcomingBirthdays: employees,
    };

    res.send(result);

  }
}





module.exports = {
  getDashboard
};