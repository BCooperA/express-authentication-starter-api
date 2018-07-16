/**
 |--------------------------------------------------------------------------
 | Authentication routes
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your auth based routes, including
 | local authentication route and social authentication routes.
 | Note! Authentication strategies are still found in config/passport.js
 |
 */
const router          = require('express').Router()
    , passport        = require('passport')
    , AuthController  = require('../../controllers/auth.controller');
/**
 |--------------------------------------------------------------------------
 | Local Authentication
 |--------------------------------------------------------------------------
 | Authenticates user using Local Strategy by Passport
 */
router.post('/signin', AuthController.local);

/**
 |--------------------------------------------------------------------------
 | Social Authentication - Facebook
 |--------------------------------------------------------------------------
 | Authenticates user using Facebook Strategy by Passport
 */
router.get('/signin/facebook', passport.authenticate('facebook', { scope: [ 'email', 'public_profile' ] }), function(req, res){});
router.get('/signin/facebook/callback', AuthController.facebook);

/**
 |--------------------------------------------------------------------------
 | Social Authentication - Twitter
 |--------------------------------------------------------------------------
 | Authenticates user using Twitter Strategy by Passport
 */
router.get('/signin/twitter', passport.authenticate('twitter'), function(req, res){});
router.get('/signin/twitter/callback', AuthController.twitter);

/**
 |--------------------------------------------------------------------------
 | Social Authentication - Google
 |--------------------------------------------------------------------------
 | Authenticates user using Google Strategy by Passport
 */
router.get('/signin/google', passport.authenticate('google', { scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}), function(req, res) {});

router.get('/signin/google/callback', AuthController.google);

module.exports = router;
