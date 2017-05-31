
/*!
 * Queiroz.js 2.6.3: util.js
 * JavaScript Extension for Dimep Kairos
 */

var Util = (function() {

    /* MODULES */

    var
        /**
         * ------------------------------------------------------------------------
         * TextFormatter
         * ------------------------------------------------------------------------
         */
        _TextFormatter = (function() {

            /* PUBLIC */

            return {
                format: function(pattern, args) {
                    for (var index = 0; index < args.length; index++) {
                        var regex = new RegExp('\\{' + index + '\\}', 'g');
                        pattern = pattern.replace(regex, args[index]);
                    }
                    return pattern;
                }
            };
        })();

    return {
        TextFormatter: _TextFormatter
    };

})();