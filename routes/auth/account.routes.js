/**
 |--------------------------------------------------------------------------
 | Account routes
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your account based routes, including
 | e-mail verification, routes for recovering and resetting user password
 |
 */
const router                        = require('express').Router()
    , validate                      = require('../../middleware/validation/validator')
    , AccountController             = require('../../controllers/account.controller');

/**
 |--------------------------------------------------------------------------
 | E-mail verification
 |--------------------------------------------------------------------------
 | HTTP Method: GET
 | Endpoint URL: "/account/email/:email"
 |--------------------------------------------------------------------------
 | Route for checking whether e-mail address is already found in the database
 */
router.get('/email/:email', AccountController.checkEmail);

/**
 |--------------------------------------------------------------------------
 | User activation
 |--------------------------------------------------------------------------
 | HTTP Method: GET
 | Endpoint URL: "/account/activate/:token"
 |--------------------------------------------------------------------------
 | Receives activation token from URI parameters,
 | validates it (runs a query to check that token belongs to someone) and eventually
 | removes activation token from the database and activates user byt setting the active property to 1
 */
router.get('/activate/:token', AccountController.activateUser);

/**
 |--------------------------------------------------------------------------
 | Password recovery request
 |--------------------------------------------------------------------------
 | HTTP Method: PUT
 | Endpoint URL: "/account/account/recover"
 |--------------------------------------------------------------------------
 | Receives email address from request body
 | validates it (runs a query to check that email belongs to someone) and eventually
 | sends an link to reset password via e-mail
 */
router.put('/password/recover', AccountController.recoverUser);

/**
 |--------------------------------------------------------------------------
 | Password reset request
 |--------------------------------------------------------------------------
 | HTTP Method: PUT
 | Endpoint URL: "/account/account/reset/:token"
 |--------------------------------------------------------------------------
 | Receives token for resetting password from URI parameters,
 | validates it (runs a query to check that token belongs to someone) and eventually
 | replaces old password with new password
 */
router.put('/account/reset/:token', [validate.password], AccountController.resetUser);

module.exports = router;
