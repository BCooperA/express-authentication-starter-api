const router                        = require('express').Router()
    , mongoose                      = require('mongoose')
    , User                          = mongoose.model('User')
    , auth                          = require('../../middleware/auth')
    , randtoken                     = require('rand-token')
    , mailer                        = require('../../helpers/mail/mailer')
    , validate                      = require('../../helpers/validation/validator')
    , { validationResult }          = require('express-validator/check');
/**
 |--------------------------------------------------------------------------
 | API Routes - Users
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your user based routes
 | for retrieving, updating, inserting and deleting users
 |
 */

/**
 |--------------------------------------------------------------------------
 | HTTP GET user "/api/user"
 |--------------------------------------------------------------------------
 |
 | Retrieves user data based on JSON Web Token saved in payload
 |
 */
router.get('/user', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user) {
        if(!user)
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });

        return res.json({user: user.toAuthJSON()});
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | HTTP GET user "/api/user/1"
 |--------------------------------------------------------------------------
 |
 | Retrieves user data based on user id in route parameter
 |
 */
router.get('/user/:id', function(req, res, next) {
    // check whether or not the object id is valid
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(401).json({ errors: [{ msg: 'invalid id' }] });

    User.findById(req.params.id).then(function(user) {
        if (!user)
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });

        return res.json({ user: user.toProfileJSONFor(user) });
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | HTTP PUT user "/api/user"
 |--------------------------------------------------------------------------
 |
 | Updates user data based on JSON Web Token saved in payload
 |
 */
router.put('/user', [validate.email, validate.firstName, validate.lastName, validate.password, auth.required], function(req, res, next) {
    // catch validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    User.findById(req.payload.id).then(function(user) {
        if(!user)
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });

        if(req.body.user.email !== undefined)
            user.email = req.body.user.email;

        if(req.body.user.lastName !== undefined)
            user.name.last = req.body.user.lastName;

        if(req.body.user.email !== undefined)
            user.email = req.body.user.email;

        if(req.body.user.firstName !== undefined)
            user.name.first = req.body.user.firstName;

        if(req.body.user.password !== undefined)
            user.password = req.body.user.password;

        user.save().then(function(){
            return res.json({user: user.toAuthJSON()});
        });
    }).catch(next);
});

/**
 |--------------------------------------------------------------------------
 | HTTP POST user "/api/users"
 |--------------------------------------------------------------------------
 |
 | Add's new user to the database
 */
router.post('/users', [validate.email, validate.firstName, validate.lastName, validate.password], function(req, res, next) {
    // catch validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

    // passwords don't match
    if(req.body.user.password !== req.body.user.passwordVrf)
        return res.status(422).json({ errors: [{ msg: 'Passwords don\'t match' }] });

    var user = new User();
    user.email = req.body.user.email;
    user.name.first = req.body.user.firstName;
    user.name.last = req.body.user.lastName;
    user.password = req.body.user.password;
    user.activation_token = randtoken.generate(32);
    user.active = 0;

    // save user
    user.save().then(function() {
        // send the mail
        var locals = {
            name: user.name.first + ' ' + user.name.last,
            siteName: process.env.APP_NAME,
            activation_url: process.env.APP_DOMAIN + '/account/activate/' + user.activation_token
        };

        mailer.sendMail(process.env.GMAIL_USER, user.email, process.env.APP_NAME + ' - Signup', 'signup', locals)
            .then(function () {
                return res.status(200).json( { status: "OK" });
            }, function (err) {
                if (err) {
                    return res.status(500).send({ errors: [{ msg: err.message } ]});
                }
            });
    });
});

module.exports = router;

