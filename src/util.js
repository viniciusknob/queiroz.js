
/*!
 * Queiroz.js 2.6.8: util.js
 * JavaScript Extension for Dimep Kairos
 */

(function(window) {

    /* Constants */

    var NAME = 'util';


    /* Module Definition */

    var Util = function() {

        /* PUBLIC */

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

    window[NAME] = Util;

})(window);