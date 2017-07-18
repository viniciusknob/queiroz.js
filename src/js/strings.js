
/*!
 * Queiroz.js: strings.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz, Resource) {

    /* Class Definition */

    var Strings = function(key) {
        return Strings._[key];
    };

    Strings._ = Resource;

    /* Module Definition */

    Queiroz.module.strings = Strings;

})(Queiroz, __strings__);
