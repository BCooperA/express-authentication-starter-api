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
    , accountHelper                 = require('../../helpers/auth/social.authentication');


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
                return res.status(404).json({ errors: [{ msg: 'User not found' }] });

            return res.json({user: user.toAuthJSON()});
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
            return res.status(401).json({ errors: [{ msg: 'invalid id' }] });

        User.findById(req.params.id).then(function(user) {
            if (!user)
                return res.status(404).json({ errors: [{ msg: 'User not found' }] });

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
            return res.status(422).json({errors: errors.array()});

        User.findById(req.payload.id).then(function(user) {
            if(!user) {
                return res.status(401).json({errors: [{ msg: 'Unauthorized request'}]});
            }

            if(user.email !== req.body.user.email){
                user.email = req.body.user.email;
            } else {
                user.email = req.payload.email;
            }

            if(typeof req.body.user.image !== 'undefined'){
                user.image = req.body.user.image;
            }
            if(typeof req.body.user.password !== 'undefined'){
                user.password = req.body.user.password;
            }

            return user.save().then(function(){
                return res.json({user: user.toAuthJSON()});
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
            return res.status(422).json({ errors: errors.array() });

        // passwords don't match
        if(req.body.user.password !== req.body.user.passwordVrf)
            return res.status(422).json({ errors: [{ msg: 'Passwords don\'t match' }] });

        let user = new User();
        user.email = req.body.user.email;
        user.name.first = req.body.user.firstName;
        user.name.last = req.body.user.lastName;
        user.password = req.body.user.password;
        user.activation_token = randtoken.generate(32);
        user.active = 0;

        user.save().then(function() {
            // save user
            let locals = {
                name: user.name.first + ' ' + user.name.last,
                siteName: process.env.APP_NAME,
                activation_url: process.env.APP_DOMAIN + '/account/activate/' + user.activation_token
            };

            // send the mail
            mailer.sendMail(process.env.GMAIL_USER, user.email, process.env.APP_NAME + ' - Signup', 'signup', locals)
                .then(function () {
                    return res.status(200).json( { status: "OK" });
                }, function (err) {
                    if (err) {
                        return res.status(500).send({ errors: [{ msg: err.message } ]});
                    }
                });
        });
    }
};

module.exports = UserController;