
/*!
 * Queiroz.js: util.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Util = function() {
        return {
            textFormat: function(pattern, args) {
                for (var index = 0; index < args.length; index++) {
                    var regex = new RegExp('\\{' + index + '\\}', 'g');
                    pattern = pattern.replace(regex, args[index]);
                }
                return pattern;
            }
        };
    }();

    /* Plugin Definition */

    Queiroz.pl.util = Util;

})(Queiroz);
