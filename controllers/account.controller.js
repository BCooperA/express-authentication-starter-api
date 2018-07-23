/**
 |--------------------------------------------------------------------------
 | Account Controller
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your account related logic that will be
 | passed to route files.
 |
 */
const mongoose                      = require('mongoose')
    , User                          = mongoose.model('User')
    , randtoken                     = require('rand-token')
    , mailer                        = require('../helpers/mail/mailer')
    , { validationResult }          = require('express-validator/check')
    , moment                        = require('moment');

let AccountController = {
    /**
     |--------------------------------------------------------------------------
     | Activates user account
     |--------------------------------------------------------------------------
     |
     */
    activate: function(req, res, next) {
        User.findOne({ "tokens.activation.token": new RegExp('^'+ req.params.token +'$', "i")}, function( err, user ) {
            if (err)
                return next(err);

            if(!user)
            // 401 unauthorized
                return res.boom.unauthorized('Invalid activation token');

            user.tokens.activation = undefined;
            user.account.active = 1;

            return user.save().then(function() {
                // 200 ok
                return res.status(200).json({ status: 'OK' });
            });
        }).catch(next);
    },


    /**
     |--------------------------------------------------------------------------
     | Generate password token to be sent via e-mail for recovering user account
     |--------------------------------------------------------------------------
     |
     */
    recover: function(req, res, next) {
        User.findOne( { "account.email": new RegExp('^'+ req.body.user.email +'$', "i") }, function(err, user) {
            if(err)
                return next(err);

            if(req.body.user.email === '' || !user)
            // 422 unprocessable entity
                return res.boom.badData('Invalid e-mail address');

            // generate a request token for password reset
            user.tokens.reset.token = randtoken.generate(32);
            user.tokens.reset.expires = moment().add(process.env.RESET_TOKEN_EXPIRES, 'minutes').format();

            user.save().then(function() {
                let locals = {
                    name: user.name,
                    siteName: process.env.APP_NAME,
                    recover_url: process.env.APP_DOMAIN + '/account/reset/' + user.tokens.reset.token
                };

                mailer.sendMail(process.env.GMAIL_USER, user.account.email, process.env.APP_NAME + ' - Recover password', 'recover', locals)
                    .then(function () {
                        // 200 ok
                        return res.status(200).json({ status: 'OK' });
                    }, function (err) {
                        if (err) {
                            // 500 internal server error
                            return res.boom.badImplementation(err.message);
                        }
                    });
            });
        }).catch(next);
    },
    /**
     |--------------------------------------------------------------------------
     | Updates user password
     |--------------------------------------------------------------------------
     |
     */
    reset: function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        // 422 unprocessable entity
            return res.boom.badData(errors.array()[0].msg);

        User.findOne({ "tokens.reset.token": new RegExp('^'+ req.params.token +'$', "i") }, function(err, user) {
            if (err)
                return next(err);

            if (!user || (moment().valueOf() < moment(user.tokens.reset.expires).valueOf() === false) )
            // 401 unauthorized
                return res.boom.unauthorized('Invalid or expired reset token');

            if(req.body.user.password !== req.body.user.passwordVrf)
            // 422 unprocessable entity
                return res.boom.badData('Passwords don\'t match');

            user.tokens.reset.token = undefined;
            user.tokens.reset.expires = undefined;
            user.account.password = req.body.user.password;

            return user.save().then(function () {
                // 200 ok
                return res.status(200).json({ status: 'OK' });
            });
        });
    },

    /**
     |--------------------------------------------------------------------------
     | check whether or not user already exists in the database
     |--------------------------------------------------------------------------
     |
     */
    checkEmail: function(req, res, next) {
        User.findOne({ "account.email": req.params.email }, function(err, user) {
            if(err)
                next(err);

            if(!user)
                // e-mail is not found
                return res.status(200).json({ status: 'OK' });
            else
                // e-mail was found in the database
                return res.boom.badData('E-mail address already in use');
        });
    }
};

module.exports = AccountController;