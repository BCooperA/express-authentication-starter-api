/**
 |--------------------------------------------------------------------------
 | Authentication Controller
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your authentication related logic that will be
 | passed to route files.
 |
 */

const mongoose        = require('mongoose')
    , User            = mongoose.model('User')
    , passport        = require('passport');

let AuthController = {
    /**
     |--------------------------------------------------------------------------
     | Local
     |--------------------------------------------------------------------------
     |
     */
    local: function(req, res, next) {
        if(req.body.user.email === '' || req.body.user.password === '')
            // overrides passports own error handler
            return res.status(422).json({errors: [{ msg: 'Missing credentials'}]});

        passport.authenticate('local', { session: false }, function(err, user, info) {
            if(err)
                return next(err);

            if(user) {
                // generate JSON web token to user
                user.token = user.generateJWT();

                // return user object
                return res.status(200).json({ user: user.toAuthJSON() });
            } else {
                // return any errors
                return res.status(422).json(info);
            }
        })(req, res, next);
    },
    /**
     |--------------------------------------------------------------------------
     | Facebook
     |--------------------------------------------------------------------------
     |
     */
    facebook: function(req, res, next) {
        passport.authenticate('facebook', { scope : ['email', 'public_profile'], session: false, failureRedirect: '/'}, function (err, user) {
            if(err)
                return next(err);

            user.token = user.generateJWT();
            // var userCookie = JSON.stringify({
            //     'id': user._id,
            //     'token': user.token
            // });

            // send user data as JSON in cookie and redirect
            // res.cookie('user', userCookie);

            //res.redirect('/app/dashboard');
            // return user object
            return res.status(200).json({ user: user.toAuthJSON() });
        })(req, res, next);
    },
    /**
     |--------------------------------------------------------------------------
     | Twitter
     |--------------------------------------------------------------------------
     |
     */
    twitter: function(req, res, next) {
        // handle the callback after twitter has authenticated the user
        passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }, function (err, user) {
            if(err)
                return next(err);

            user.token = user.generateJWT();


            // var userCookie = JSON.stringify({
            //     'id': user._id,
            //     'token': user.token
            // });
            //
            // // save user data as JSON in cookie and redirect

            // res.cookie('user', userCookie);
            // // res.redirect('/app/dashboard');

            // return user object
            return res.status(200).json({ user: user.toAuthJSON() });
        })(req, res, next);
    },

    /**
     |--------------------------------------------------------------------------
     | Google
     |--------------------------------------------------------------------------
     |
     */
    google: function(req, res, next) {
        // handle the callback after google has authenticated the user
        passport.authenticate('google', { failureRedirect: '/login' }, function(err, user) {
            if(err)
                return next(err);

            user.token = user.generateJWT();
            // var userCookie = JSON.stringify({
            //     'id': user._id,
            //     'token': user.token
            // });
            //
            // // save user data as JSON in cookie and redirect
            // res.cookie('user', userCookie);

            //res.redirect('/app/dashboard');

            // return user object
            return res.status(200).json({ user: user.toAuthJSON() });
        })(req, res, next);
    }
};

module.exports = AuthController;