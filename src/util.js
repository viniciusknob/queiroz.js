
/*!
 * Queiroz.js 2.6.2: util.js
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
        })(),

        /**
         * ------------------------------------------------------------------------
         * TimeFormatter
         * ------------------------------------------------------------------------
         */
        _TimeFormatter = (function(Time) {

            var
                _normalize = function(number) {
                    return (number < 10 ? '0' + number : number);
                };

            /* PUBLIC */

            return {
                dateToHumanTime: function(date) {
                    return _normalize(date.getHours()) + ':' + _normalize(date.getMinutes());
                },
                millisToHumanTime: function(millis) {
                    var
                        diffHour = parseInt(millis / Time.Millis.In.HOUR),
                        diffMin = parseInt((millis / Time.Millis.In.MINUTE) % 60);

                    return _normalize(diffHour) + ':' + _normalize(diffMin);
                }
            };
        })(Time);

    return {
        TextFormatter: _TextFormatter,
        TimeFormatter: _TimeFormatter
    };

})();