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
    , { validationResult }          = require('express-validator/check');

let AccountController = {
    /**
     |--------------------------------------------------------------------------
     | Activates user account
     |--------------------------------------------------------------------------
     |
     */
    activateUser: function(req, res, next) {
        User.findOne({ activation_token: new RegExp('^'+ req.params.token +'$', "i")}, function( err, user ) {
            if (err)
                return next(err);

            if(!user)
            // invalid activation token
                return res.status(422).json({ errors: [{ msg:  'invalid activation token' }] });

            user.activation_token = '';
            user.active = 1;
            user.save();

            return res.status(200).json({ status: 'OK' });
            //return res.redirect('/account/login');
        }).catch(next);
    },


    /**
     |--------------------------------------------------------------------------
     | Generate password token to be sent via e-mail for recovering user account
     |--------------------------------------------------------------------------
     |
     */
    recoverUser: function(req, res, next) {
        User.findOne( { email: new RegExp('^'+ req.body.user.email +'$', "i") }, function(err, user) {
            if(err)
                return next(err);

            if(req.body.user.email === '' || !user)
            // invalid or empty email address
                return res.status(422).json({ errors: [{ msg: 'invalid e-mail address' }] });

            // generate a request token for password reset
            user.request_password_token = randtoken.generate(32);

            user.save().then(function() {
                let locals = {
                    name: user.name,
                    siteName: process.env.APP_NAME,
                    recover_url: process.env.APP_DOMAIN + '/account/reset/' + user.request_password_token
                };

                mailer.sendMail(process.env.GMAIL_USER, user.email, process.env.APP_NAME + ' - Recover password', 'recover', locals)
                    .then(function () {
                        return res.status(200).json({ status: 'OK' });
                    }, function (err) {
                        if (err) {
                            return res.status(500).send({ errors: [{ msg: err.message } ] });
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
    resetUser: function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        // return validation errors
            return res.status(422).json({ errors: errors.array() });

        User.findOne({ password_reset_token: new RegExp('^'+ req.params.token +'$', "i") }, function(err, user) {
            if (err)
                return next(err);

            if (!user)
            // reset token not provided or invalid
                return res.status(422).json({ errors: [{ msg: 'invalid reset token' }] });

            if(req.body.user.password !== req.body.user.passwordVrf)
            // passwords don't match
                return res.status(422).json({ errors: [{ msg: 'passwords don\'t match' }] });

            user.password_reset_token = '';
            user.password = req.body.user.password;

            return user.save().then(function () {
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
        User.findOne({ email: req.params.email }, function(err, user) {
            if(err)
                next(err);

            if(!user)
            // e-mail is not found
                return res.status(200).json({ status: 'OK' });
            else
            // e-mail was found in the database
                return res.status(422).json({ errors: [{ msg: 'e-mail address already in use' }] });
        });
    }
};

module.exports = AccountController;