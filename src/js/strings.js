
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

    /* Plugin Definition */

    Queiroz.pl.strings = Strings;

})(Queiroz, __strings__);
