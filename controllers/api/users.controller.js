/**
 |--------------------------------------------------------------------------
 | User Controller
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your user related logic that will be
 | passed to route files.
 |
 */
const mongoose                      = require('mongoose')
    , User                          = mongoose.model('User')
    , randtoken                     = require('rand-token')
    , mailer                        = require('../../helpers/mail/mailer')
    , { validationResult }          = require('express-validator/check')
    , accountHelper                 = require('../../helpers/auth/social.authentication')
    , boom                          = require('express-boom');



let UserController = {
    /**
     |--------------------------------------------------------------------------
     | Retrieves user account based on payload (JWT)
     |--------------------------------------------------------------------------
     |
     */
    getByPayload: function(req, res, next) {
        User.findById(req.payload.id).then(function(user) {
            if(!user)
                return res.boom.notFound('User not found');

            return res.json({ user: user.toAuthJSON() });
        }).catch(next);
    },


    /**
     |--------------------------------------------------------------------------
     | Retrieves user account based on ID within request parameters
     |--------------------------------------------------------------------------
     |
     */
    getById: function(req, res, next) {
        // check whether or not the object id is valid
        if(!mongoose.Types.ObjectId.isValid(req.params.id))
            return res.boom.unauthorized('Invalid id');

        User.findById(req.params.id).then(function(user) {
            if (!user)
                return res.boom.notFound('User not found');

            return res.json({ user: user.toProfileJSONFor(user) });
        }).catch(next);
    },
    /**
     |--------------------------------------------------------------------------
     | Updates user
     |--------------------------------------------------------------------------
     |
     */
    update: function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.boom.badData(errors.array()[0].msg);

        User.findById(req.payload.id).then(function(user) {
            if(!user) {
                return res.boom.unauthorized('Unauthorized request');
            }

            if(typeof req.body.user.image !== 'undefined'){
                user.image = req.body.user.image;
            }
            if(typeof req.body.user.password !== 'undefined'){
                user.password = req.body.user.password;
            }

            return user.save().then(function(){
                return res.json({ user: user.toAuthJSON() });
            });
        }).catch(next);
    },
    /**
     |--------------------------------------------------------------------------
     | Creates new user
     |--------------------------------------------------------------------------
     |
     */
    create: function(req, res, next) {
        // catch validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.boom.badData(errors.array()[0].msg);

        // passwords don't match
        if(req.body.user.password !== req.body.user.passwordVrf)
            return res.boom.badData('Passwords don\'t  match');

        let user = new User();
        user.account.active = 0;
        user.account.email = req.body.user.email;
        user.account.password = req.body.user.password;
        user.account.name.givenName = req.body.user.firstName;
        user.account.name.familyName = req.body.user.lastName;

        user.tokens.activation = randtoken.generate(32);
        user.save().then(function() {
            // save user
            let locals = {
                name: user.account.name.givenName + ' ' + user.account.name.familyName,
                siteName: process.env.APP_NAME,
                activation_url: process.env.APP_DOMAIN + '/account/activate/' + user.activation_token
            };

            // send the mail
            mailer.sendMail(process.env.GMAIL_USER, user.account.email, process.env.APP_NAME + ' - Signup', 'signup', locals)
                .then(function () {
                    return res.status(200).json( { status: "OK" });
                }, function (err) {
                    if (err) {
                        return res.boom.badImplementation(err.message);
                    }
                });
        });
    }
};

module.exports = UserController;