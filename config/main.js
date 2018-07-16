/**
 |--------------------------------------------------------------------------
 | Configuration - Main
 |--------------------------------------------------------------------------
 | This file is where you may define all of the configuration for your application
 |
 */
module.exports = {
    jwt_secret: process.env.JWT_SECRET,
    session_secret: process.env.SESSION_SECRET,

    database: {
        mongo: {
            url: process.env.MONGO_URL
        }
    },
    auth: {
        providers: {
            facebook: {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL,
                profileFields: ['id', 'first_name', 'last_name', 'emails', 'locale', 'picture.type(large)', 'location'],
                enableProof: true
            },
            twitter: {
                consumerKey: process.env.TWITTER_CONSUMER_KEY,
                consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
                callbackURL: process.env.TWITTER_CALLBACK_URL,
                includeEmail: true

            },
            google: {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            }
        }
    },
    mail: {
        nodemailer: {
            gmail: {
                options: {
                    service: 'gmail',
                    auth: {
                        user: process.env.GMAIL_USER,
                        pass: process.env.GMAIL_PASSWORD
                    }
                }
            }
        }
    }
};
