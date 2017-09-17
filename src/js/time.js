/*!
 * Queiroz.js: time.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        Settings = Queiroz.settings,
        DayOff   = Queiroz.module.dayoff;

    /* Class Definition */

    var Time = function() {

        /* Constants */

        var
            ZERO_TIME = '00:00',
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60,
            DAILY_GOAL_MINUTES_IN_MILLIS = Settings.DAILY_GOAL_MINUTES * MINUTE_IN_MILLIS,
            MAX_CONSECUTIVE_MINUTES_IN_MILLIS = Settings.MAX_CONSECUTIVE_MINUTES * MINUTE_IN_MILLIS;

        /* Private Functions */

        var
            _computeWeeklyGoalMillis = function() {
                return (Settings.WEEKLY_GOAL_MINUTES * MINUTE_IN_MILLIS) - (DayOff.count * DAILY_GOAL_MINUTES_IN_MILLIS);
            },
            _diff = function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() - init.getMillis();
                } else {
                    return end - init;
                }
            },
            _hourToMillis = function(hour) {
                return hour * HOUR_IN_MILLIS;
            },
            _minuteToMillis = function(minute) {
                return minute * MINUTE_IN_MILLIS;
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
            },
            _computeShiftTime = function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        time.shift = false;
                        if (time.in && time.out)
                            time.shift = _diff(time.in, time.out);
                        else if (time.in)
                            time.shift = _diff(time.in, Date.now());
                    });
                });
            },
            _computeLaborTime = function(data) {
                data.worked = 0;
                data.days.forEach(function(day) {
                    day.worked = 0;
                    day.worked += day.timeOn;
                    day.periods.forEach(function(time) {
                        if (time.in && time.out)
                            day.worked += time.shift
                    });
                    data.worked += day.worked;
                });
            },
            _computeBalanceTime = function(data) {
                var totalBalance = 0; // compilation of all days, except the current day
                data.days.forEach(function(day) {
                    day.balance = 0; // balance per day
                    if (day.periods.length) {
                        day.balance = (0 - DAILY_GOAL_MINUTES_IN_MILLIS) + day.worked;
                        if (day.date.isToday() == false) {
                            totalBalance += day.balance;
                        }
                        day.totalBalance = totalBalance;
                    }
                });
                data.weeklyBalance = (0 - _computeWeeklyGoalMillis()) + data.worked;
            },
            _computeTimeToLeave = function(data) {
                data.days.forEach(function(day) {
                    var _periods = day.periods;
                    if (day.date.isToday() && _periods.length) {
                        var _time = _periods.last();
                        if (_time.out == false) {
                            if (day.worked < DAILY_GOAL_MINUTES_IN_MILLIS) {
                                var pending = _diff(day.worked, DAILY_GOAL_MINUTES_IN_MILLIS);
                                _time.leave = new Date(_time.in.getMillis() + pending);
                                _time.balancedLeave = new Date(_time.leave.getMillis() - day.totalBalance);
                            }
                        }
                    }
                });
            };

        /* Public Functions */

        return {
            parse: function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        if (time.in)
                            time.in = Date.parseKairos(day.date + " " + time.in);

                        if (time.out)
                            time.out = Date.parseKairos(day.date + " " + time.out);
                    });
                    day.date = Date.parseKairos(day.date + " " + ZERO_TIME);
                });
            },
            compute: function(data) {
                _computeShiftTime(data);
                _computeLaborTime(data);
                _computeBalanceTime(data);
                _computeTimeToLeave(data);
            },
            toHuman: function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        if (time.in)
                            time.in = time.in.getTimeAsString();

                        if (time.out)
                            time.out = time.out.getTimeAsString();

                        if (time.shift)
                            time.shift = _millisToHuman(time.shift);

                        if (time.leave)
                            time.leave = time.leave.getTimeAsString();

                        if (time.balancedLeave)
                            time.balancedLeave = time.balancedLeave.getTimeAsString();
                    });
                    day.goal = _millisToHuman(DAILY_GOAL_MINUTES_IN_MILLIS);
                    day.worked = _millisToHuman(day.worked);
                    day.balance = _millisToHumanWithSign(day.balance);
                    day.totalBalance = _millisToHumanWithSign(day.totalBalance);
                    if (day.timeOn)
                        day.timeOn = _millisToHuman(day.timeOn);
                });
                data.weeklyGoal = _millisToHuman(_computeWeeklyGoalMillis());
                data.worked = _millisToHuman(data.worked);
                data.weeklyBalance = _millisToHumanWithSign(data.weeklyBalance);
            },
            zero: ZERO_TIME,
            diff: _diff,
            minuteToMillis: _minuteToMillis,
            millisToHuman: _millisToHuman,
            millisToHumanWithSign: _millisToHumanWithSign,
            humanToMillis: _humanToMillis
        };
    }();

    /* Module Definition */

    Queiroz.module.time = Time;

})(Queiroz);
