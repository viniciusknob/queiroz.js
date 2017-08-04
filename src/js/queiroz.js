
/*!
 * Queiroz.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Class Definition */

    var Queiroz = function() {

        /* Constants */

        var
            NAME = 'Queiroz.js',
            VERSION = '__version__',

            Settings = {
                USERSCRIPT_DELAY_MILLIS: 1000,
                MAX_CONSECUTIVE_HOURS_PER_DAY: 6,
                MAX_HOURS_PER_WEEK: 44,
                MAX_MINUTES_PER_DAY: (8 * 60) + 48,
                // Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
                INITIAL_WEEKDAY: 1,
                // false, ON, DOING, DONE
                LAST_WEEK_MODE: false
            };

        /* Public Functions */

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          module: {},
          settings: Settings
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);
