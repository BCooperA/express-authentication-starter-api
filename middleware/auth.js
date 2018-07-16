/**
 |--------------------------------------------------------------------------
 | Middleware - Authentication
 |--------------------------------------------------------------------------
 |
 | A middleware to validate API requests by JSON token
 |
 */
const jwt     = require('express-jwt')
    , secret  = require('../config/main').jwt_secret;

let auth = {
    /**
     |--------------------------------------------------------------------------
     | Read JSON token from the request header parameters
     |--------------------------------------------------------------------------
     */
    getTokenFromHeader: function (req) {
        // look for header named "authorization" with value of "Token" or "Bearer"
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
            req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

            // return the actual token after "Token" or "Bearer"
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    },

    required: jwt({
        secret: secret,
        userProperty: 'payload',
        getToken: this.getTokenFromHeader
    }),

    optional: jwt({
        secret: secret,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: this.getTokenFromHeader
    })
};

module.exports = auth;
