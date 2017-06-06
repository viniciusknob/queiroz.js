
/*!
 * Queiroz.js 2.6.10: time.js
 * JavaScript Extension for Dimep Kairos
 */

(function(window) {

    /* Constants */

    var NAME = 'time';


    /* Module Definition */

    var Time = function() {

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
            _normalize = function(number) {
                return (number < 10 ? '0' + number : number);
            },
            _Hour = (function() {
                return {
                    toMillis: function(hour) {
                        return hour * _Millis.IN_HOUR;
                    }
                };
            })(),
            _Minute = (function() {
                return {
                    toMillis: function(minute) {
                        return minute * _Millis.IN_MINUTE;
                    }
                };
            })(),
            _Millis = (function() {

                var
                    MINUTE_IN_MILLIS = 1000 * 60,
                    HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60;

                /* PUBLIC */

                return {
                    IN_MINUTE: MINUTE_IN_MILLIS,
                    IN_HOUR: HOUR_IN_MILLIS,
                    diff: function(init, end) {
                        if (init instanceof Date && end instanceof Date) {
                            return end.getTime() - init.getTime();
                        } else {
                            return end - init;
                        }
                    },
                    toHumanTime: function(millis) {
                        var
                            diffHour = parseInt(millis / HOUR_IN_MILLIS),
                            diffMin = parseInt((millis / MINUTE_IN_MILLIS) % 60);

                        return _normalize(diffHour) + ':' + _normalize(diffMin);
                    }
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
            },
            dateToHumanTime: function(date) {
                return _normalize(date.getHours()) + ':' + _normalize(date.getMinutes());
            }
        };
    }();

    window[NAME] = Time;

})(window);