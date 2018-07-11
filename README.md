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
- Authenticates users locally with username and password
```
POST - /auth/signin 
```
- Authenticates users with Facebook
```
GET  - /auth/signin/facebook/callback 
```
- Authenticates users with Twitter
```
GET  - /auth/signin/twitter/callback 
```
- Authenticates users with Google
```
GET  - /auth/signin/google/callback 
```
- Checks whether or not e-mail address already exists
```
GET  - /account/email/:email 
```
- Activates user account
```
GET  - /account/activate/:activation_token 
```
- Send reset instructions via e-mail
```
PUT  - /account/password/recover 
```
- Reset password
```
PUT  - /account/password/reset/:token 
```
- Returns auth data for user based on payload
```
GET  - /api/user 
```
- Returns user data based by id
```
GET  - /api/user/:id 
```
- Updates user
```
PUT  - /api/user 
```
- Creates new user
```
POST - /api/users 
```

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









