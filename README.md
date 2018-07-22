# express-authentication-starter-api 

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
| POST | /auth/signin                    |     email, password    | Authenticates users with username and password |
| GET  | /auth/signin/facebook/callback  |                        | Authenticates users with Facebook |
| GET  | /auth/signin/twitter/callback   |                        | Authenticates users with Twitter |
| GET  | /auth/signin/google/callback    |                        | Authenticates users with Google |

### Account

|Method| Endpoint URL                       | Params (if needed)     | Action       |
| ---- |---------------------| --------------------------------------| -------------|
| GET | /account/email/:email               |        email           | Checks whether or not e-mail address already exists |
| GET | /account/activate/:token            |        token           | Activates user account |
| PUT | /account/password/recover           |                        | Send reset instructions via e-mail |
| PUT  | /account/password/reset/:token     |        token           | Resets password |

### User

|Method| Endpoint URL        |         Params (if needed)         | Action       |
| ---- |---------------------| -----------------------------------| -------------|
| GET | /api/user            |                                    | Returns authentication data for user based on payload |
| GET | /api/user/:id        |               id                   | Returns user data based on id |
| PUT | /api/user            |                                    | Updates user data
| POST| /api/users           |                                    | Creates new user |


## Configuration

`NOTE:` When working with keys and tokens, it is better to use randomly generated keys. 
You can generate strong passwords and keys with [RandomKeygen](https://randomkeygen.com)

### Environment variables
The following environment variables are mandatory:

```
APP_NAME=            # <- name of the application
APP_DOMAIN=          # <- domain of the application
DEVELOPMENT_MODE=    # <- current development mode
MONGO_URL=           # <- mongo database url
JWT_SECRET=          # <- secret key for json web tokens (jwt)
SESSION_SECRET=      # <- secret key for sessions
```

In addition, if social authentication is used, the following environment variables are also mandatory:

```
FACEBOOK_CLIENT_ID=         # <- client ID of your Facebook application
FACEBOOK_CLIENT_SECRET=     # <- client secret of your Facebook application
FACEBOOK_CALLBACK_URL=      # <- callback url when facebook authentication was successful

TWITTER_CONSUMER_KEY=       # <- client ID of your Twitter application
TWITTER_CONSUMER_SECRET=    # <- client secret of your Twitter application
TWITTER_CALLBACK_URL=       # <- callback url when twitter authentication was successful

GOOGLE_CLIENT_ID=           # <- client ID of your Google application
GOOGLE_CLIENT_SECRET=       # <- client secret of your Google application
GOOGLE_CALLBACK_URL=        # <- callback url when google authentication was successful
```

If emails are sent via Gmail, the following environment variables are mandatory:
```
GMAIL_USER=         # <- Gmail username
GMAIL_PASSWORD=     # <- Gmail password

```

### User Model
By default, the `User` model will have a following schema:

```json
{
	"_id" : "5b54ff68e1f46c527ad9fd64",
	"updatedAt" : "2018-07-22T22:04:24.967Z",
	"createdAt" : "2018-07-22T22:04:24.967Z",
	"tokens" : {
		"reset" : "",
		"activation" : "dPr1Rc654dIcjmeQhoF213z6Pv9NoFtM"
	},
	"account" : {
		"password" : "$2a$10$DtHlTExi3c5jKlP5y2SWvOtP7QcJNodoi30QglWQ/cL0r5cT3FcDC",
		"email" : "test@user.com",
		"name" : {
			"familyName" : "John",
			"givenName" : "Doe"
		},
		"active" : 0
	},
	"__v" : 0
}
```

### Error handling 
By default, errors are returned as JSON in following format:

```json
{
"statusCode": 404,
"error": "Not Found",
"message": "Not Found"
}
```

### Social authentication

Unlike local authentication, social authentication does not work out of the box. 
First, you need to provide `ID` and `secret key` of your social application.

* [Where can I find my Facebook application ID and Secret?](https://stackoverflow.com/questions/3203649/where-can-i-find-my-facebook-application-id-and-secret-key)
* [How do I find my Twitter application ID and Consumer Secret key ?](https://twittercommunity.com/t/how-do-i-find-my-consumer-key-and-secret/646/2)
* [How can I get my Google account Client ID and Client Secret key?](https://www.appypie.com/faqs/how-can-i-get-my-google-acount-client-id-and-client-secret-key)

### JSON Web Token (JWT)
By default, JWT token expires in 60 minutes. If you want to extend the lifetime of this token, adjust the `exp` property of the JWT.

In `models/User.js`:

```javascript
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

## TODOS

* ~~Better error handling with Boom.~~
* Load modules conditionally based on production mode
* Add expiration date to tokens








