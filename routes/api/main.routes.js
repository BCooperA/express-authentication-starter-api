/**
 |--------------------------------------------------------------------------
 | API Routes - Main
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your applications routes to
 | use the router middleware
 |
 */
const router = require('express').Router();

router.use('/', require('./users.routes'));

module.exports = router;