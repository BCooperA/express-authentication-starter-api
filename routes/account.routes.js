const router                        = require('express').Router()
    , mongoose                      = require('mongoose')
    , User                          = mongoose.model('User')
    , randtoken                     = require('rand-token')
    , mailer                        = require('../helpers/mail/mailer')
    , validate                      = require('../helpers/validation/validator')
    , { validationResult }          = require('express-validator/check');

/**
 |--------------------------------------------------------------------------
 | Account routes
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your account based routes, including
 | e-mail verification, routes for recovering and resetting user password
 |
 */

/**
 |--------------------------------------------------------------------------
 | E-mail verification
 |--------------------------------------------------------------------------
 | Route for checking whether e-mail address is already found in the database
 */
router.get('/email/:email', function(req, res, next) {
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
});

/**
 |--------------------------------------------------------------------------
 | Activate user
 |--------------------------------------------------------------------------
 | Receives activation token from URI parameters,
 | validates it (runs a query to check that token belongs to someone) and eventually
 | removes activation token from the database and activates user byt setting the active property to 1
 */
router.get('/activate/:activation_token', function(req, res, next) {
    User.findOne({ activation_token: new RegExp('^'+ req.params.activation_token +'$', "i")}, function( err, user ) {
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
});

/**
 |--------------------------------------------------------------------------
 | Password recovery request
 |--------------------------------------------------------------------------
 | Receives email address from request body
 | validates it (runs a query to check that email belongs to someone) and eventually
 | sends an link to reset password via e-mail
 */
router.put('/password/recover', function(req, res, next) {
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
                        return res.status(500).send({ errors: [{ msg: err.message } ]});
                    }
                });
        });
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | Password reset request
 |--------------------------------------------------------------------------
 | Receives token for resetting password from URI parameters,
 | validates it (runs a query to check that token belongs to someone) and eventually
 | replaces old password with new password
 */
router.put('/password/reset/:password_reset_token', [validate.password], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty())
    // return validation errors
        return res.status(422).json({ errors: errors.array() });

    User.findOne({ password_reset_token: new RegExp('^'+ req.params.password_reset_token +'$', "i") }, function(err, user) {
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
});

module.exports = router;
