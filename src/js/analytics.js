/*!
 * Queiroz.js: analytics.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 *
 * Analytics DevGuide:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/
 */

(function(Queiroz, ga) {

    var
        Settings = Queiroz.settings,
        trackerName = 'qzTkr';

    ga('create', Settings.GA_TRACKING_ID, 'auto', trackerName);

    ga(trackerName+'.set', {
        appName: Queiroz.name,
        appVersion: Queiroz.version
    });

    ga(trackerName+'.send', 'screenview', {
        screenName: document.querySelector('.PageTitle').textContent
    });

})(Queiroz, ga);
