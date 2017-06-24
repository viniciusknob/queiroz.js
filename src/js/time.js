
/*!
 * Queiroz.js: time.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Constants */

    var NAME = 'time';


    /* Module Definition */

    var Time = function() {

        var
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60,

            _normalize = function(number) {
                return (number < 10 ? '0' + number : number);
            },
            // Date object, getDay() method returns the weekday as a number
            _weekday = {
                SUNDAY: 0,
                MONDAY: 1,
                TUESDAY: 2,
                WEDNESDAY: 3,
                THURSDAY: 4,
                FRIDAY: 5,
                SATURDAY: 6
            };

        /* PUBLIC */

        return {
            zero: '00:00',
            fake: '12:34',
            dateToHuman: function(date) {
                return _normalize(date.getHours()) + ':' + _normalize(date.getMinutes());
            },
            millisToHuman: function(millis) {
                var
                    diffHour = parseInt(millis / HOUR_IN_MILLIS),
                    diffMin = parseInt((millis / MINUTE_IN_MILLIS) % 60);

                return _normalize(diffHour) + ':' + _normalize(diffMin);
            },
            diff: function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getTime() - init.getTime();
                } else {
                    return end - init;
                }
            },
            hourToMillis: function(hour) {
                return hour * HOUR_IN_MILLIS;
            },
            minuteToMillis: function(minute) {
                return minute * MINUTE_IN_MILLIS;
            },
            isToday: function(date) {
                var today = new Date();
                return date.getDate() === today.getDate() &&
                       date.getMonth() === today.getMonth() &&
                       date.getFullYear() === today.getFullYear();
            },
            toDate: function(stringDate) { // 14_05_2017 16:08
                var
                    dateTime = stringDate.split(' '),
                    date = dateTime[0].split('_'),
                    time = dateTime[1].split(':');
                return new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
            },
            Weekday: _weekday
        };
    }();

    window[NAME] = Time;

})(window);