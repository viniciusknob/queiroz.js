
/*!
 * Queiroz.js 2.6.4: util.js
 * JavaScript Extension for Dimep Kairos
 */

var Util = (function() {

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

})();