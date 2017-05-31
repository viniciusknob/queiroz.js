
/*!
 * Queiroz.js 2.6.1: time.js
 * JavaScript Extension for Dimep Kairos
 */

var Time = (function() {

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

            /* PUBLIC */

            return {
                diff: function(init, end) {
                    if (init instanceof Date && end instanceof Date) {
                        return end.getTime() - init.getTime();
                    } else {
                        return end - init;
                    }
                },
                In: {
                    MINUTE: 1000 * 60,
                    HOUR: 1000 * 60 * 60
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
        }
    };
})();