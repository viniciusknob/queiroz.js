
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
            SETTINGS = __settings__;

        /* Public Functions */

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          module: {},
          settings: SETTINGS
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);
