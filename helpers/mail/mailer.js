/**
 |--------------------------------------------------------------------------
 | Helpers - Mailer
 |--------------------------------------------------------------------------
 |
 | A helper function for sending template e-mails
 | Special thanks to Josh Greenberg: https://codemoto.io/coding/nodejs/nodemailer-email-templates-using-node
 | emailTemplates repo: https://github.com/niftylettuce/email-templates
 |
 */
const Q                 = require('q')
    , nodemailer        = require('nodemailer')
    , emailTemplates    = require('email-templates')
    , mailOptions       = require('../../config/main').mail;

const Mailer = {
    _template: null,
    _transport: null,

    init: function (config) {
        var d = Q.defer();

        new emailTemplates(config.emailTplsDir, function (err, template) {
            if (err) {
                return d.reject(err);
            }

            this._template = template;
            this._transport = nodemailer.createTransport(mailOptions.nodemailer.gmail.options);
            return d.resolve();
        }.bind(this));

        return d.promise;
    },

    send: function (from, to, subject, text, html) {
        var d = Q.defer();
        var params = {
            from: from,
            to: to,
            subject: subject,
            text: text
        };

        if (html) {
            params.html = html;
        }

        this._transport.sendMail(params, function (err, res) {
            if (err) {
                console.error(err);
                return d.reject(err);
            } else {
                return d.resolve(res);
            }
        });

        return d.promise;
    },

    sendMail: function (from, to, subject, tplName, locals) {
        var d = Q.defer();
        var self = this;

        this.init({ emailTplsDir: "views/email-templates" }).then(function () {
            this._template(tplName, locals, function (err, html, text) {
                if (err) {
                    console.error(err);
                    return d.reject(err);
                }

                self.send(from, to, subject, text, html)
                    .then(function (res) {
                        return d.resolve(res);
                    });
            });
        }.bind(this));

        return d.promise;
    }
};

module.exports = Mailer;