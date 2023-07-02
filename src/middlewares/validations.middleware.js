const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }
  next();
};

exports.createUserValidation = [
  body('name').notEmpty().withMessage('name can`t be empty'),
  body('email').notEmpty().withMessage(' email can`t be empty'),
  body('password')
    .notEmpty()
    .withMessage('password can`t be empty')
    .isLength({ min: 7 })
    .withMessage('password have to be at least 7 words length '),
  validFields,
];

exports.createRestaurant = [
  body('name').notEmpty().withMessage('name can`t be empty'),
  body('address').notEmpty().withMessage('address can`t be empty'),
  body('rating').notEmpty().withMessage('rating can`t be empty'),
  validFields,
];

exports.createMealValid = [
  body('name').notEmpty().withMessage('name can`t be empty'),
  body('price')
    .notEmpty()
    .withMessage('price can`t be empty')
    .isNumeric()
    .withMessage('price have to be a number '),
  validFields,
];
