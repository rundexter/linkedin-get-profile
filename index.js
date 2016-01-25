var Linkedin = require('node-linkedin')(),
    util = require('./util.js');

var pickOutputs = {
        'id': 'id',
        'firstName': 'firstName',
        'headline': 'headline',
        'lastName': 'lastName',
        'url': 'siteStandardProfileRequest.url'
    };

module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = Linkedin.init(dexter.provider('linkedin').credentials('access_token')),
            fields = ['id', 'first-name', 'headline', 'last-name', 'site-standard-profile-request'];

        linkedIn.people.me(fields, function(err, data) {
            if (err || (data && data.errorCode !== undefined))
                this.fail(err || (data.message || 'Error Code: '.concat(data.errorCode)));
            else
                this.complete(util.pickOutputs(data, pickOutputs));

        }.bind(this));
    }
};
