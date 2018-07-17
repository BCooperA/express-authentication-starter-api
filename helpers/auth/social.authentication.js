const mongoose      = require('mongoose')
    , User          = mongoose.model('User')
    , Q             = require('q');

let socialAuthentication = {
    defineProvider: function(route) {
        return console.log(route.substring(route.lastIndexOf('/')).substring(1));
    },

    save: function(newUser) {
        let d = Q.defer();

        User.create(this.newUserFromProfile(newUser)).then(function(err, user) {
            if(err)
                return d.reject(err);
            else
                return d.resolve(user);
        });
        return d.promise;
    },

    findOrFail: function(user) {
        let d = Q.defer();

        User.findOne({'$or': [{
                'auth.oauthID': user.id,
                'auth.provider': 'facebook'
            }, {
                'email': user.emails[0].value
            }]}).then(function(err, user) {
            if (err) {
                return d.reject(err);
            }

            if (user) {
                // if user is found in the database
                return d.resolve(user);
            }
        });
        return d.promise;
    },

    newUserFromProfile: function(profile) {
        let user = new User({
            'auth.provider': 'facebook',
            'auth.oauthID': profile.id,
            'password': '',
            'name': {
                'first': profile._json.first_name,
                'last': profile._json.last_name
            },
            'email': profile.emails[0].value,
            'image': profile.photos[0].value,
            'active': 1
        });

        return user;
    }
}

module.exports = socialAuthentication;

