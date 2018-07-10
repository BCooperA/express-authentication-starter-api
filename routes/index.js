const router = require('express').Router();

/**
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can require your routes from all the sub-folders and files
| for your application.
|
*/
router.use('/auth', require('./auth.routes'));
router.use('/account', require('./account.routes'));
router.use('/api', require('./api'));

module.exports = router;
