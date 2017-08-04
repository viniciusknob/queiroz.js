/*!
 * Queiroz.js: time.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var Settings = Queiroz.settings;

    /* Class Definition */

    var Time = function() {

        /* Constants */

        var
            FAKE_TIME = '12:34',
            ZERO_TIME = '00:00',
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60,
            MAX_HOURS_PER_WEEK_IN_MILLIS = Settings.MAX_HOURS_PER_WEEK * HOUR_IN_MILLIS,
            MAX_MINUTES_PER_DAY_IN_MILLIS = Settings.MAX_MINUTES_PER_DAY * MINUTE_IN_MILLIS,
            MAX_CONSECUTIVE_HOURS_PER_DAY_IN_MILLIS = Settings.MAX_CONSECUTIVE_HOURS_PER_DAY * HOUR_IN_MILLIS;

        /* Private Functions */

        var
            _diff = function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() - init.getMillis();
                } else {
                    return end - init;
                }
            },
            _isToday = function(date) {
                var _now = new Date();
                return date.getDayOfMonth() === _now.getDayOfMonth() &&
                       date.getMonth() === _now.getMonth() &&
                       date.getFullYear() === _now.getFullYear();
            },
            _toDate = function(stringDate) { // 14_05_2017 16:08
                var
                    dateTime = stringDate.split(' '),
                    date = dateTime[0].split('_'),
                    time = dateTime[1].split(':');
                return new Date(date[2], date[1] - 1, date[0], time[0], time[1]);
            },
            _minuteToMillis = function(minute) {
                return minute * MINUTE_IN_MILLIS;
            },
            _millisToHuman = function(millis) {
                var
                    diffHour = parseInt(millis / HOUR_IN_MILLIS),
                    diffMin = parseInt((millis / MINUTE_IN_MILLIS) % 60);

                return diffHour.format(2) + ':' + diffMin.format(2);
            },
            _millisToHumanWithSign = function(millis) {
                if (millis == 0)
                    return ZERO_TIME;

                if (millis > 0)
                    return '+' + _millisToHuman(millis);

                if (millis < 0)
                    return '-' + _millisToHuman(millis * -1);
            },
            _computeShiftTime = function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        time.shift = false;
                        if (time.in && time.out)
                            time.shift = _diff(time.in, time.out);
                    });
                });
            },
            _computeLaborTime = function(data) {
                data.totalLabor = 0;
                data.days.forEach(function(day) {
                    day.labor = 0;
                    day.periods.forEach(function(time) {
                        if (time.shift)
                            day.labor += time.shift
                    });
                    data.totalLabor += day.labor;
                });
            },
            _computeBalanceTime = function(data) {
                var _now = new Date();
                data.totalPreviousBalance = 0;
                data.days.forEach(function(day) {
                    day.balance = (0 - MAX_MINUTES_PER_DAY_IN_MILLIS) + day.labor;
                    if (day.date.getDayOfMonth() < _now.getDayOfMonth()) {
                        data.totalPreviousBalance += day.balance;
                    }
                });
                data.totalBalance = (0 - MAX_HOURS_PER_WEEK_IN_MILLIS) + data.totalLabor;
            },
            _computeTimeToLeave = function(data) {
                data.days.forEach(function(day) {
                    var _periods = day.periods;
                    if (_isToday(day.date) && _periods.length) {
                        var _time = _periods.last();
                        if (_time.out == false) {
                            if (day.labor <= MAX_MINUTES_PER_DAY_IN_MILLIS) {
                                var pending = _diff(day.labor, MAX_MINUTES_PER_DAY_IN_MILLIS);
                                _time.leave = new Date(_time.in.getMillis() + pending);
                                _time.balancedLeave = _time.leave + day.balance;
                            }
                        }
                    }
                });
            };

        /* Public Functions */

        return {
            transformToDate: function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        if (time.in)
                            time.in = _toDate(day.date + " " + time.in);

                        if (time.out)
                            time.out = _toDate(day.date + " " + time.out);
                    });
                    day.date = _toDate(day.date + " " + FAKE_TIME);
                });
            },
            computeTimes: function(data) {
                _computeShiftTime(data);
                _computeLaborTime(data);
                _computeTimeToLeave(data);
                _computeBalanceTime(data);
            },
            transformToHuman: function(data) {
                data.totalLabor = _millisToHuman(data.totalLabor);
                data.totalPreviousBalance = _millisToHumanWithSign(data.totalPreviousBalance);
                data.totalBalance = _millisToHumanWithSign(data.totalBalance);
                data.days.forEach(function(day) {
                    day.labor = _millisToHuman(day.labor);
                    day.balance = _millisToHumanWithSign(day.balance);
                    day.periods.forEach(function(time) {
                        if (time.in)
                            time.in = time.in.getTimeAsString();

                        if (time.out)
                            time.out = time.out.getTimeAsString();

                        if (time.shift)
                            time.shift = _millisToHuman(time.shift);
                    });
                });
            },
            hourToMillis: function(hour) {
                return hour * HOUR_IN_MILLIS;
            },
            zero: ZERO_TIME,
            fake: FAKE_TIME,
            diff: _diff,
            toDate: _toDate,
            isToday: _isToday,
            minuteToMillis: _minuteToMillis,
            millisToHuman: _millisToHuman,
            millisToHumanWithSign: _millisToHumanWithSign
        };
    }();

    /* Module Definition */

    Queiroz.module.time = Time;

})(Queiroz);
