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
     * Authorize module.
     *
     * @param dexter
     * @returns {*}
     */
    authModule: function (dexter) {
        var accessToken = dexter.environment('linkedin_access_token');

        if (accessToken)
            return Linkedin.init(accessToken);

        else
            return false;
    },


    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var linkedIn = this.authModule(dexter),
            fields = ['id', 'first-name', 'headline', 'last-name', 'site-standard-profile-request'];

        if (!linkedIn)
            return this.fail('A [linkedin_access_token] environment need for this module.');

        linkedIn.people.me(fields, function(err, data) {
            if (err)
                this.fail(err);

            else if (data.errorCode !== undefined)
                this.fail(data.message || 'Error Code'.concat(data.errorCode));

            else
                this.complete(util.pickResult(data, pickOutputs));

        }.bind(this));
    }
};
