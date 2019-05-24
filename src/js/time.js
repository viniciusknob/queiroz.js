/*!
 * Queiroz.js: time.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings;

    /* Class Definition */

    var Time = function() {

        /* Constants */

        var
            ZERO_TIME = '00:00',
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60;

        /* Private Functions */

        var
            _diff = function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() - init.getMillis();
                } else {
                    return end - init;
                }
            },
            _before =  function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() > init.getMillis();
                } else {
                    return end > init;
                }
            },
            _hourToMillis = function(hour) {
                return hour * HOUR_IN_MILLIS;
            },
            _minuteToMillis = function(minute) {
                return minute * MINUTE_IN_MILLIS;
            },
            _millisToMinute = function(millis) {
                return parseInt(millis / MINUTE_IN_MILLIS);
            },
            _millisToHuman = function(millis) {
                var
                    diffHour = parseInt(millis / HOUR_IN_MILLIS),
                    diffMin = parseInt((millis / MINUTE_IN_MILLIS) % 60);

                return diffHour.padStart(2) + ':' + diffMin.padStart(2);
            },
            _millisToHumanWithSign = function(millis) {
                if (millis == 0)
                    return ZERO_TIME;

                if (millis > 0)
                    return '+' + _millisToHuman(millis);

                if (millis < 0)
                    return '-' + _millisToHuman(millis * -1);
            },
            _humanToMillis = function(humanTime) {
                var
                    time = humanTime.split(':'),
                    hour = parseInt(time[0]),
                    min = parseInt(time[1]);

                return (_hourToMillis(hour) + _minuteToMillis(min));
            };

        /* Public Functions */

        return {
            zero: ZERO_TIME,
            diff: _diff,
            before: _before,
            hourToMillis: _hourToMillis,
            minuteToMillis: _minuteToMillis,
            millisToMinute: _millisToMinute,
            millisToHuman: _millisToHuman,
            millisToHumanWithSign: _millisToHumanWithSign,
            humanToMillis: _humanToMillis
        };
    }();

    /* Module Definition */

    Queiroz.module.time = Time;

})(Queiroz);
