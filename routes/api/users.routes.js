/**
 |--------------------------------------------------------------------------
 | API Routes - Users
 |--------------------------------------------------------------------------
 |
 | This file is where you may define all of your user user based routes
 | for retrieving, updating and inserting users
 |
 */
const router                        = require('express').Router()
    , auth                          = require('../../middleware/auth')
    , validate                      = require('../../middleware/validation/validator')
    , UserController                = require('../../controllers/api/users.controller');

/**
 |--------------------------------------------------------------------------
 | HTTP Method: GET
 | Endpoint URL: "/api/user"
 |--------------------------------------------------------------------------
 | Retrieves user data based on JSON Web Token saved in payload
 |
 */
router.get('/user', auth.required, UserController.getByPayload);

/**
 |--------------------------------------------------------------------------
 | HTTP Method: GET
 | Endpoint URL: "/api/user/:id"
 |--------------------------------------------------------------------------
 | Retrieves user data based on user id in route parameter
 |
 */
router.get('/user/:id', auth.required, UserController.getById);

/**
 |--------------------------------------------------------------------------
 | HTTP Method: PUT
 | Endpoint URL: "/api/user"
 |--------------------------------------------------------------------------
 | Updates user data based on JSON Web Token saved in payload
 |
 */
router.put('/user', [validate.email, validate.firstName, validate.lastName, validate.password, auth.required], UserController.update);

/**
 |--------------------------------------------------------------------------
 | HTTP Method: POST
 | Endpoint URL: "/api/users"
 |--------------------------------------------------------------------------
 | Add's new user to the database
 */
router.post('/users', [validate.email, validate.firstName, validate.lastName, validate.password], UserController.create);

module.exports = router;

