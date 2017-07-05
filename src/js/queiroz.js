
/*!
 * Queiroz.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Class Definition */

    var Queiroz = function() {
        var
            NAME = 'Queiroz.js',
            VERSION = '@VERSION';

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          pl: {}
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);
