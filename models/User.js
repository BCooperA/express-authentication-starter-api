/**
 |--------------------------------------------------------------------------
 | Models - User
 |--------------------------------------------------------------------------
 |
 | This is the Mongoose model file for MongoDB's User collection.
 | In here, you can define all the database properties and methods for User
 |
 */
const mongoose            = require('mongoose')
    , bcrypt              = require('bcrypt-nodejs')
    , SALT_WORK_FACTOR    = 10
    , jwt                 = require('jsonwebtoken')
    , secret              = require('../config/main').jwt_secret;

const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.ObjectId,
        auto: true
    },
    auth: {
        provider: String,
        oauthID: Number,
    },

    account: {
        active: {
            type: Number,
            default: 0,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
        },
        password: {
            type: String
        },
        name: {
            givenName: {
                type: String,
                required: true
            },
            familyName: {
                type: String,
                required: true
            }
        },
        image: String,
    },
    tokens: {
        activation: {
            type: String,
            default: ''
        },
        reset: {
            type: String,
            default: ''
        }
    }
}, {
    timestamps: true
});

/**
 * Check whether the entered password matches with the salt and hash saved in the database
 * @param password
 * @returns {boolean}
 */
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.account.password);
};

/**
 * Hash password with blowfish algorithm (bcrypt) before saving it in to the database
 */
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('account.password'))
        return next();

    user.account.password = bcrypt.hashSync(user.account.password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
    next();
});

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

/**
 * Returns users id, email and the toke for JWT
 * @returns {*}
 */
UserSchema.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT()
    };
};

/**
 * Returns users public information
 * @returns {*}
 */
UserSchema.methods.toProfileJSONFor = function(user) {
    return {
        _id: this._id,
        username: this.username,
        name: this.name.first + ' ' + this.name.last,
        location: this.location,
        // bio: this.bio,
        image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    };
};

mongoose.model('User', UserSchema);
