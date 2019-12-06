
/*!
 * Queiroz.js: strings.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Strings = function(key) {
        return Strings._[key];
    };

    Strings._ = JSON.parse('__strings__');

    /* Module Definition */

    Queiroz.module.strings = Strings;

})(window.Queiroz);
