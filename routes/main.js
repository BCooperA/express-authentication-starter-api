/**
 |--------------------------------------------------------------------------
 | API Routes
 |--------------------------------------------------------------------------
 |
 | Here is the main file of routes where you can require your routes from all the sub-folders and files
 | for your application.
 |
 */

const router = require('express').Router();

router.use('/auth', require('./auth/auth.routes'));
router.use('/account', require('./auth/account.routes'));
router.use('/api', require('./api/main.routes'));

module.exports = router;
