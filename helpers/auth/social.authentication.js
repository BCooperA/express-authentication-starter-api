const mongoose      = require('mongoose')
    , User          = mongoose.model('User')
    , Q             = require('q');

let socialAuthentication = {

    defineProvider: function(route) {
        return console.log(route.substring(route.lastIndexOf('/')).substring(1));
    },

    save: function(newUser) {
        let d = Q.defer();

        this.findOrFail(newUser).then(function(err, user) {
            if(err) {
                return d.reject(err);
            }
            if(user) {
                return d.resolve(null, user);
            }
            let newSchema = {
                'auth.provider': 'facebook',
                'auth.oauthID': newUser.id,
                'password': '',
                'name': {
                    'first': newUser._json.first_name,
                    'last': newUser._json.last_name
                },
                'email': newUser.emails[0].value,
                'image': newUser.photos[0].value,
                'active': 1
            };

            User.create(newSchema).then(function(err, createdUser) {
                if(err)
                    return d.reject(err);
                else
                    return d.resolve(null, createdUser);
            });
        });
        return d.promise;
    },

    findOrFail: function(profile) {
        console.log("OK!");
        let d = Q.defer();

        User.findOne({'$or': [{
                'auth.oauthID': profile.id,
                'auth.provider': 'facebook'
            }, {
                'email': profile.emails[0].value
            }]}).then(function(err, user) {
            if (err) {
                console.log(err);
                return d.reject(err);
            }

            if (user) {
                console.log(user);
                return d.reject(user);
            } else {
                return d.resolve();
            }
        });
        return d.promise;
    },

    newUserFromProfile: function(profile) {
        let d = Q.defer();

        let user = {
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
        };

        d.resolve(user);

        return d.promise;
    }
}

module.exports = socialAuthentication;

