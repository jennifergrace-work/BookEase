const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMap = {};
    errors.array().forEach(err => {
      errorMap[err.path || err.param] = err.msg;
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMap,
    });
  }
  next();
};

module.exports = { validate };
