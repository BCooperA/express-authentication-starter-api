const util                          = require('util')
    , mongoose                      = require('mongoose')
    , User                          = mongoose.model('User')
    , { check, validationResult }   = require('express-validator/check');


let validation = {
    /**
     |--------------------------------------------------------------------------
     | Validate e-mail addresses
     |--------------------------------------------------------------------------
     | Must pass the following rules:
     |  - is not an empty string
     |  - is a valid email address (must contain '@' and address domain suffix (.com, .net ...)
     |  - is under 256 characters long
     |  - is unique (doesn't exist in the database)
     |--------------------------------------------------------------------------
     */
    email: util.promisify(
        check('user.email')
            .not().isEmpty().withMessage('Email can\'t be empty.')
            .isEmail().withMessage('Invalid e-mail address.')
            .isLength({ max: 256 }).withMessage('Email is too long.')
            .custom(value => {
                return User.findOne({email: value}).then(user => {
                    if (user)
                        return Promise.reject('E-mail already in use');
                })
            })
    ),

    /**
     |--------------------------------------------------------------------------
     | Validate first name
     |--------------------------------------------------------------------------
     | Must pass the following rules:
     |  - is not an empty string
     |  - is a minimum of 2 characters long
     |  - is under 30 characters long
     |--------------------------------------------------------------------------
     */
    firstName: util.promisify(
        check('user.firstName')
            .not().isEmpty().withMessage('Provide your real name')
            .isLength({ min: 2 }).withMessage('First name is too short.')
            .isLength({ max: 30 }).withMessage('First name is too long.')
    ),

    /**
     |--------------------------------------------------------------------------
     | Validate last name
     |--------------------------------------------------------------------------
     | Must pass the following rules:
     |  - is not an empty string
     |  - is a minimum of 2 characters long
     |  - is under 50 characters long
     |--------------------------------------------------------------------------
     */
    lastName: util.promisify(
        check('user.lastName')
            .not().isEmpty().withMessage('Provide your real name')
            .isLength({ min: 2 }).withMessage('Last name is too short.')
            .isLength({ max: 50 }).withMessage('Last name is too long.')
    ),

    /**
     |--------------------------------------------------------------------------
     | Validate passwords
     |--------------------------------------------------------------------------
     | Must pass the following rules:
     |  - is not an empty string
     |  - is a minimum of 8 caharacters long
     |  - contains at least one uppercase letter
     |  - contains at least one lowercase letter
     |  - contains at least one digit
     |--------------------------------------------------------------------------
     */
    password: util.promisify(
        check('user.password')
            .not().isEmpty().withMessage('Password can\'t be empty.')
            .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)
            .withMessage('Password must contain at least 8 characters, with one digit and at least one uppercase and lower case letter')
    )
};

module.exports = validation;

