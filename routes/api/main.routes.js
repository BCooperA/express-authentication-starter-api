/**
 |--------------------------------------------------------------------------
 | API Routes - Main
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your applications routes to
 | use the router middleware
 |
 */
const router = require('express').Router();

router.use('/', require('./users.routes'));

/**
 |--------------------------------------------------------------------------
 | Error Handler - Validation Errors
 |--------------------------------------------------------------------------
 | Handle validation errors as JSON
 */
router.use(function(err, req, res, next) {
    if(err.name === 'ValidationError') {
        res.status(422).json({
            errors: Object.keys(err.errors).reduce(function(errors, key) {
                errors[key] = err.errors[key].message;

                return errors;
            }, {})
        });

    }
    return next(err);
});

module.exports = router;