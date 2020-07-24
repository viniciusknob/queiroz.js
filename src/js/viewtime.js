/*!
 * Queiroz.js: viewtime.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        mod       = Queiroz.module,
        Settings  = mod.settings,
        Time      = mod.time,
        DailyGoal = mod.dailygoal,
        DayOff    = mod.dayoff;

    /* Class Definition */

    var ViewTime = function() {

        /* Constants */

        var
            MAX_CONSECUTIVE_MINUTES_IN_MILLIS = Time.minuteToMillis(Settings.MAX_CONSECUTIVE_MINUTES),
            MAX_DAILY_MINUTES_IN_MILLIS = Time.minuteToMillis(Settings.MAX_DAILY_MINUTES);


        /* Private Functions */

        var
            _computeDailyGoalMinutesInMillis = function(day) {
                return Time.minuteToMillis(DailyGoal.get(day));
            },
            _computeWeeklyGoalMinutesInMillis = function() {
                return Time.minuteToMillis(DailyGoal.computeWeeklyGoalMinutes());
            },
            _computeFixedWeeklyGoalInMillis = function(days) {
                var millisOff = 0;
                var workedDays = [];
                days.forEach(function(day) {
                    if (DayOff.is(day.date))
                        millisOff += _computeDailyGoalMinutesInMillis(day.date.getDay());
                    
                    workedDays.push(day.date.getDay());
                });
                
                let daysLastIsCurrentWeek = days.length && days.last().date.isCurrentWeek(Settings.INITIAL_WEEKDAY);
                let fixedCurrentWeekDay = daysLastIsCurrentWeek ? (Date.now().getDay() === 0 ? 7 : Date.now().getDay()) : 7;
                
                for (let idx = 1; idx <= fixedCurrentWeekDay; idx++) {
                    let fixedIdx = idx === 7 ? 0 : idx; // use native day of week
                    if (workedDays.contains(fixedIdx) == false)
                        millisOff += _computeDailyGoalMinutesInMillis(fixedIdx);
                }
                
                return _computeWeeklyGoalMinutesInMillis() - millisOff;
            },
            _computeShiftTime = function(data) {
                data.days.forEach(function(day) {
                    day.periods.forEach(function(time) {
                        time.shift = false;
                        if (time.in && time.out){
                            if(Time.before(time.in, time.out)) {
                                time.shift = Time.diff(time.in, time.out);
                            } else {
                                var endOfFirstDay = new Date(time.in.getTime());
                                endOfFirstDay.setHours(23,59,59,999);
                                var initOfSecondDay = new Date(time.out.getTime());
                                initOfSecondDay.setHours(0,0,0,0);
                                var initDiff = Time.diff(time.in, endOfFirstDay);
                                var endDiff = Time.diff(initOfSecondDay, time.out);
                                time.shift = initDiff + endDiff + 1000;
                            }
                        } else if (time.in) {
                            time.shift = Time.diff(time.in, Date.now());
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
                    if (day.timeOn)
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
                        var isWorkDay = Settings.isWorkDay(day.date);
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
                data.weeklyBalance = (_computeFixedWeeklyGoalInMillis(data.days)*(-1)) + data.worked;
            },
            _computeTimeToLeave = function(data) {
                data.days.forEach(function(day) {
                    var _periods = day.periods;
                    if (day.date.isToday() && _periods.length) {
                        var _time = _periods.last();
                        if (_time.out == false) {
                            if (day.worked <= Time.hourToMillis(4)) { // Values above 4h exceed the max daily limit
                                _time.leaveMaxConcec = new Date(_time.in.getMillis() + MAX_CONSECUTIVE_MINUTES_IN_MILLIS);
                            }
                            var dailyGoalMillis = _computeDailyGoalMinutesInMillis(day.date.getDay());
                            var safeTimeLeave = dailyGoalMillis - MAX_CONSECUTIVE_MINUTES_IN_MILLIS; // Values below exceed the max consecutive limit
                            var isWeeklyGoalNear = (data.weeklyBalance*(-1)) < MAX_CONSECUTIVE_MINUTES_IN_MILLIS;
                            if ((day.worked >= safeTimeLeave && day.worked < dailyGoalMillis) || isWeeklyGoalNear) {
                                let pending = Time.diff(day.worked, dailyGoalMillis);
                                _time.leave = new Date(_time.in.getMillis() + pending);
                                _time.balancedLeave = new Date(_time.leave.getMillis() - day.totalBalance);
                            }
                            if (day.worked > Time.hourToMillis(4)) { // Values below 4h confuse decision making
                                let pending = Time.diff(day.worked, MAX_DAILY_MINUTES_IN_MILLIS);
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
                    day.date = Date.parseKairos(day.date + " " + Time.zero);
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
                            time.shift = Time.millisToHuman(time.shift);

                        if (time.leaveMaxConcec)
                            time.leaveMaxConcec = time.leaveMaxConcec.getTimeAsString();

                        if (time.leave)
                            time.leave = time.leave.getTimeAsString();

                        if (time.leaveMaxDaily)
                            time.leaveMaxDaily = time.leaveMaxDaily.getTimeAsString();

                        if (time.balancedLeave)
                            time.balancedLeave = time.balancedLeave.getTimeAsString();
                    });
                    day.goal = Time.millisToHuman(_computeDailyGoalMinutesInMillis(day.date.getDay()));
                    day.worked = Time.millisToHuman(day.worked);
                    day.reallyWorked = Time.millisToHuman(day.reallyWorked);
                    day.balance = Time.millisToHumanWithSign(day.balance);
                    day.totalBalance = Time.millisToHumanWithSign(day.totalBalance);
                    if (day.timeOn)
                        day.timeOn = Time.millisToHuman(day.timeOn);
                });
                data.maxConsecutive = Time.millisToHuman(MAX_CONSECUTIVE_MINUTES_IN_MILLIS);
                data.maxDaily = Time.millisToHuman(MAX_DAILY_MINUTES_IN_MILLIS);
                data.weeklyGoal = Time.millisToHuman(_computeFixedWeeklyGoalInMillis(data.days));
                data.worked = Time.millisToHuman(data.worked);
                data.reallyWorked = Time.millisToHuman(data.reallyWorked);
                data.weeklyBalance = Time.millisToHumanWithSign(data.weeklyBalance);
            },
            parsePeriodRange: function(periodRange) {
                let
                    periodArr = periodRange.split("a"),
                    period = [];
                periodArr.forEach(dateStr => {
                    let 
                        dateStrArr = dateStr.trim().split("/"),
                        dd = parseInt(dateStrArr[0]),
                        mm = parseInt(dateStrArr[1])-1,
                        yyyy = parseInt(dateStrArr[2]);
                    period.push(new Date(yyyy, mm, dd));
                });
                return {
                    begin: period[0],
                    end: period[1]
                };
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.viewtime = ViewTime;

})(window.Queiroz);
