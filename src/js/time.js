/*!
 * Queiroz.js: time.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        DayOff   = mod.dayoff;

    /* Class Definition */

    var Time = function() {

        /* Constants */

        var
            ZERO_TIME = '00:00',
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60,
            MAX_CONSECUTIVE_MINUTES_IN_MILLIS = Settings.MAX_CONSECUTIVE_MINUTES * MINUTE_IN_MILLIS,
            MAX_DAILY_MINUTES_IN_MILLIS = Settings.MAX_DAILY_MINUTES * MINUTE_IN_MILLIS;

        /* Private Functions */

        var
            _computeDailyGoalMinutesInMillis = function(day) {
                return Settings.DAILY_GOAL_MINUTES[day] * MINUTE_IN_MILLIS;
            },
            _computeWeeklyGoalMillis = function() {
                var millisOff = DayOff.count * _computeDailyGoalMinutesInMillis(1); // FIXME hardcoded day
                return (Settings.computeWeeklyGoalMinutes() * MINUTE_IN_MILLIS) - millisOff;
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
            _before =  function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() > init.getMillis();
                } else {
                    return end > init;
                }
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
            },
            _computeShiftTime = function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        time.shift = false;
                        if (time.in && time.out){
                            if(_before(time.in, time.out)) {
                                time.shift = _diff(time.in, time.out);
                            } else {
                                var endOfFirstDay = new Date(time.in.getTime());
                                endOfFirstDay.setHours(23,59,59,999);
                                var initOfSecondDay = new Date(time.out.getTime());
                                initOfSecondDay.setHours(00,00,00,000);
                                var initDiff = _diff(time.in, endOfFirstDay);
                                var endDiff = _diff(initOfSecondDay, time.out);
                                time.shift = initDiff + endDiff + 1000;
                            }
                        } else if (time.in) {
                            time.shift = _diff(time.in, Date.now());
                        }
                    });
                });
            },
            _computeLaborTime = function(data) {
                data.worked = 0; // in/out OK
                data.reallyWorked = 0; // in OK, out undefined
                data.days.forEach(function(day) {
                    day.worked = 0; // in/out OK
                    day.reallyWorked = 0; // in OK, out undefined
                    day.worked += day.timeOn;
                    day.periods.forEach(function(time) {
                        if (time.in && (time.out == false && day.date.isToday()))
                            day.reallyWorked += time.shift;
                        if (time.in && time.out)
                            day.worked += time.shift
                    });
                    day.reallyWorked += day.worked;
                    data.worked += day.worked;
                    data.reallyWorked += day.reallyWorked;
                });
            },
            _computeBalanceTime = function(data) {
                var totalBalance = 0; // compilation of all days, except the current day
                data.days.forEach(function(day) {
                    day.balance = 0; // balance per day
                    if (day.periods.length) {
                        var isWorkDay = Settings.WORK_DAYS.contains(day.date.getDay());
                        if (isWorkDay) {
                            day.balance = (0 - _computeDailyGoalMinutesInMillis(day.date.getDay()));
                        }
                        day.balance += day.worked;
                        if (day.date.isToday() == false || isWorkDay == false) {
                            totalBalance += day.balance;
                        }
                        day.totalBalance = totalBalance;
                    }
                });
                data.weeklyBalance = (_computeWeeklyGoalMillis()*(-1)) + data.worked;
            },
            _computeTimeToLeave = function(data) {
                data.days.forEach(function(day) {
                    var _periods = day.periods;
                    if (day.date.isToday() && _periods.length) {
                        var _time = _periods.last();
                        if (_time.out == false) {
                            if (day.worked <= _hourToMillis(4)) { // Values above 4h exceed the max daily limit
                                _time.leaveMaxConcec = new Date(_time.in.getMillis() + MAX_CONSECUTIVE_MINUTES_IN_MILLIS);
                            }
                            var dailyGoalMillis = _computeDailyGoalMinutesInMillis(day.date.getDay());
                            var safeTimeLeave = dailyGoalMillis - MAX_CONSECUTIVE_MINUTES_IN_MILLIS; // Values below exceed the max consecutive limit
                            var isWeeklyGoalNear = (data.weeklyBalance*(-1)) < MAX_CONSECUTIVE_MINUTES_IN_MILLIS;
                            if ((day.worked >= safeTimeLeave && day.worked < dailyGoalMillis) || isWeeklyGoalNear) {
                                var pending = _diff(day.worked, dailyGoalMillis);
                                _time.leave = new Date(_time.in.getMillis() + pending);
                                _time.balancedLeave = new Date(_time.leave.getMillis() - day.totalBalance);
                            }
                            if (day.worked > _hourToMillis(4)) { // Values below 4h confuse decision making
                                var pending = _diff(day.worked, MAX_DAILY_MINUTES_IN_MILLIS);
                                _time.leaveMaxDaily = new Date(_time.in.getMillis() + pending);
                            }
                            _time.orderBy = _defineOrderBy(_time);
                        }
                    }
                });
            },
            _defineOrderBy = function(lastPeriod) {
                var variables = ['leave','balancedLeave','leaveMaxConcec','leaveMaxDaily'];
                variables.sort(function(a,b) {
                    if (lastPeriod[a] == null)
                        return -1;

                    if (lastPeriod[b] == null)
                        return 1;

                    return lastPeriod[a].getMillis() - lastPeriod[b].getMillis();
                });
                return variables;
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
                data.date = Date.now();
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

                        if (time.leaveMaxConcec)
                            time.leaveMaxConcec = time.leaveMaxConcec.getTimeAsString();

                        if (time.leave)
                            time.leave = time.leave.getTimeAsString();

                        if (time.leaveMaxDaily)
                            time.leaveMaxDaily = time.leaveMaxDaily.getTimeAsString();

                        if (time.balancedLeave)
                            time.balancedLeave = time.balancedLeave.getTimeAsString();
                    });
                    day.goal = _millisToHuman(_computeDailyGoalMinutesInMillis(day.date.getDay()));
                    day.worked = _millisToHuman(day.worked);
                    day.reallyWorked = _millisToHuman(day.reallyWorked);
                    day.balance = _millisToHumanWithSign(day.balance);
                    day.totalBalance = _millisToHumanWithSign(day.totalBalance);
                    if (day.timeOn)
                        day.timeOn = _millisToHuman(day.timeOn);
                });
                data.maxConsecutive = _millisToHuman(MAX_CONSECUTIVE_MINUTES_IN_MILLIS);
                data.maxDaily = _millisToHuman(MAX_DAILY_MINUTES_IN_MILLIS);
                data.weeklyGoal = _millisToHuman(_computeWeeklyGoalMillis());
                data.worked = _millisToHuman(data.worked);
                data.reallyWorked = _millisToHuman(data.reallyWorked);
                data.weeklyBalance = _millisToHumanWithSign(data.weeklyBalance);
            },
            zero: ZERO_TIME,
            diff: _diff,
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
