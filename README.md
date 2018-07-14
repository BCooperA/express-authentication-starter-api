A small, easily extendable base API for authenticating users with JSON Web Token (JWT), written with Express.js.

## Installation

*1.* Install [Node.js](https://nodejs.org/en/)

*2.* Clone the starter app to your desktop using `clone` command:
```
git clone https://github.com/BCooperA/express-authentication-starter-api.git
```

*3.* Download and [install](https://docs.mongodb.com/manual/installation/) MongoDB to your desktop

*4.* After installing MongoDB, create a new database for your application
```
> use YOUR_DATABASE_NAME
```

*5.* Create a `.env` file from `.env.example` and add environment variables

*6.* Install required dependencies for the application
```
npm install
```

*7.* Run application

```
node server

```

OR

```
npm run dev

```

## What's included ?
* Local authentication - Authenticate users statelessly with [Passport.js](https://github.com/jaredhanson/passport) using [JSON Web Tokens (JWT)](https://jwt.io)
* Social authentication - Authenticate users via Facebook, Twitter or Google with [Passport.js](https://github.com/jaredhanson/passport)
* Request validation - validate user input with pre-built middlewares, using [express-validator](https://github.com/express-validator/express-validator) 
* Password recovery / reset
* Mongoose User schema, easy to extend. Read more about [Mongoose](http://mongoosejs.com)
* Emails - Templated e-mails for signup and password recover

## API Routes

### Authentication

|Method| Endpoint URL                    | Params (if needed)     | Action       |
| ---- |---------------------| -----------------------------------| -------------|
| POST | /auth/signin                    | email, password        | Authenticates users with username and password |
| GET  | /auth/signin/facebook/callback  |                        | Authenticates users with Facebook |
| GET  | /auth/signin/twitter/callback   |                        | Authenticates users with Twitter |
| GET  | /auth/signin/google/callback    |                        | Authenticates users with Google |

### Account

|Method| Endpoint URL                       | Params (if needed)     | Action       |
| ---- |---------------------| --------------------------------------| -------------|
| GET | /account/email/:email               | email                  | Checks whether or not e-mail address already exists |
| GET | /account/activate/:activation_token |   activation_token     | Activates user account |
| PUT | /account/password/recover           |                        | Send reset instructions via e-mail |
| PUT  | /account/password/reset/:token     |    token               | Resets password |

### User

|Method| Endpoint URL        | Params (if needed)                 | Action       |
| ---- |---------------------| -----------------------------------| -------------|
| GET | /api/user            |                                    | Returns authentication data for user based on payload |
| GET | /api/user/:id        |    id                              | Returns user data based on id |
| PUT | /api/user            |                                    | Updates user data
| POST  | /api/users         |                                    | Creates new user |

## Error handling 
By default, errors are returned as JSON in following format:

```
{
  "errors": [
    {
      "msg": "Error message"
    }
  ]
}
```


## Configuration
By default the JWT token expires in 60 minutes. If you want to extend the lifetime of this token, adjust the `exp` property of the JWT:

```
/**
 * Generates JSON Web Token (JWT) for authenticated user
 * @returns {*}
 */
UserSchema.methods.generateJWT = function() {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // Set the token expire time to 60 min
    }, secret);
};

```









