
const { Daily } = require('../models');

const getDailySummaryById = async (id) => {
  return Daily.findById(id);
};

module.exports = {
  getDailySummaryById,
};
