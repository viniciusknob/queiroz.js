
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
            VERSION = '__version__';

        /* Public API */

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          module: {}
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);
