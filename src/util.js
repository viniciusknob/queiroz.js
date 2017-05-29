
/*!
 * Queiroz.js 2.5.0: util.js
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
         * Time
         * ------------------------------------------------------------------------
         */
        _Time = (function() {

            var
                // Date object, getDay() method returns the weekday as a number
                Weekday = {
                    SUNDAY: 0,
                    MONDAY: 1,
                    TUESDAY: 2,
                    WEDNESDAY: 3,
                    THURSDAY: 4,
                    FRIDAY: 5,
                    SATURDAY: 6
                },
                _Hour = (function() {
                    return {
                        toMillis: function(hour) {
                            return hour * _Millis.In.HOUR;
                        }
                    };
                })(),
                _Minute = (function() {
                    return {
                        toMillis: function(minute) {
                            return minute * _Millis.In.MINUTE;
                        }
                    };
                })(),
                _Millis = (function() {

                    var
                        _In = {
                            MINUTE: 1000 * 60,
                            HOUR: 1000 * 60 * 60
                        };

                    /* PUBLIC */

                    return {
                        diff: function(init, end) {
                            if (init instanceof Date && end instanceof Date) {
                                return end.getTime() - init.getTime();
                            } else {
                                return end - init;
                            }
                        },
                        In: _In
                    };
                })();

            /* PUBLIC */

            return {
                Hour: _Hour,
                Minute: _Minute,
                Millis: _Millis,
                Weekday: Weekday,
                toDate: function(stringDate) { // 14_05_2017 16:08
                    var
                        dateTime = stringDate.split(' '),
                        date = dateTime[0].split('_'),
                        time = dateTime[1].split(':');
                    return new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
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
        })(_Time),

        /**
         * ------------------------------------------------------------------------
         * View
         * ------------------------------------------------------------------------
         */
        _View = (function() {

            /* PUBLIC */

            return {
                append: function(selector, html) {
                    var _this = this;
                    _this.asyncReflow(function() {
                        var
                            element = _this.get(selector),
                            container = document.createElement('div');
                        container.innerHTML = html;
                        element.appendChild(container);
                    });
                },
                asyncReflow: function(task) {
                    setTimeout(task, 25);
                },
                get: function(selector, target) {
                    return (target || document).querySelector(selector);
                },
                getAll: function(selector, target) {
                    return (target || document).querySelectorAll(selector);
                }
            };
        })();

    return {
        TextFormatter: _TextFormatter,
        Time: _Time,
        TimeFormatter: _TimeFormatter,
        View: _View
    };

})();