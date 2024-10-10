const { check, body } = require('express-validator')

exports.validRegister = [
  check('name', 'Name is required')
    .notEmpty()
    .isLength({
      min: 4,
    })
    .withMessage('Name must be more than 4 characters'),
  check('email', 'Must be a valid email address').isEmail(),
  check('password', 'password is required')
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
  check('phone', 'Phone Number must be greater than 6 digits').isLength({
    min: 6,
  }),
  check('address', "Address can't be empty")
    .notEmpty()
    .isLength({
      min: 4,
    })
    .withMessage('Address must be more than 4 characters'),
  // body('categories')
  //   .custom((value, { req }) => {
  //     console.log('this', req.role, value.length)
  //     if (req.role === 'technician' && value.length > 0) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   })
  //   .withMessage('Technician must at least select one category'),
]

exports.validLogin = [
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password', 'password is required').notEmpty(),
  check('password')
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain at least 6 characters'),
]

exports.resetPasswordValidator = [
  check('newPassword', 'password is required')
    .notEmpty()
    .isLength({
      min: 6,
    })
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
]
