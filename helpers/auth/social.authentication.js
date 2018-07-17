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
            if(err)
                console.log(err);
            return d.reject(err);

            if(user) {
                console.log(user);
                return d.reject(user);
            } else {
                User.create(this.newUserFromProfile(newUser)).then(function (err, user) {
                    if (err) {
                        console.log(err);
                        return d.reject(err);
                    } else {
                        console.log(user);
                        return d.resolve(user);
                    }
                });
            }
        });

        return d.promise;
    },

    findOrFail: function(user) {
        console.log("OK!");
        let d = Q.defer();

        User.findOne({'$or': [{
                'auth.oauthID': user.id,
                'auth.provider': 'facebook'
            }, {
                'email': user.emails[0].value
            }]}).then(function(err, user) {
                console.log("Search ready!");
            if (err) {
                console.log(err);
                return d.reject(err);
            }

            if (user) {
                // if user is found in the database
                console.log("Found in the database");
                console.log(user);
                return d.reject(user);
            } else {
                return d.resolve();
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

