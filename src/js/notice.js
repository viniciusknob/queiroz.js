
/*!
 * Queiroz.js: notice.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Notification, Queiroz) {

    /* Modules */

    var
        mod       = Queiroz.module,
        Settings  = mod.settings,
        Time      = mod.time,
        Strings   = mod.strings,
        DailyGoal = mod.dailygoal;

    /* Class Definition */

    var Notice = function() {

        /* Constants */

        var NOTICE_RANGE_MINUTES = Settings.NOTICE_RANGE_MINUTES;

        /* Private Functions */

        var
            _notified = true,
            _fired = [],
            _closeFiredOnUnload = function() {
                _fired.forEach(function(notification) {
                    notification.close();
                });
            },
            _notify = function(title, message) {
                _fired.push(new Notification(title, {
                    body: message,
                    icon: Settings.NOTICE_ICON
                }));

                _notified = true;
            },
            _formatMessage = function(message, minute) {
                return message.replace('_min_', minute);
            },
            _checkWeeklyGoal = function(title, data) {
                if (_notified)
                    return;

                NOTICE_RANGE_MINUTES.forEach(function(minute) {
                    if ((DailyGoal.computeWeeklyGoalMinutes() - minute) == Time.millisToMinute(data.reallyWorked))
                        _notify(title, _formatMessage(Strings('noticeWeeklyGoal'), minute));
                });
            },
            _checkDailyGoal = function(title, data) {
                if (_notified)
                    return;

                NOTICE_RANGE_MINUTES.forEach(function(minute) {
                    data.days.forEach(function(day) {
                        if (day.date.isToday()) {
                            day.periods.forEach(function(time) {
                                if (time.out == false)
                                    if ((Settings.DAILY_GOAL_MINUTES[day.date.getDay()] - minute) == Time.millisToMinute(day.reallyWorked))
                                        _notify(title, _formatMessage(Strings('noticeDailyGoal'), minute));
                            });
                        }
                    });
                });
            },
            _checkBalancedLeave = function(title, data) {
                if (_notified)
                    return;

                NOTICE_RANGE_MINUTES.forEach(function(minute) {
                    data.days.forEach(function(day) {
                        if (day.date.isToday()) {
                            day.periods.forEach(function(time) {
                                if (time.out == false && time.balancedLeave) {
                                    var balancedLeaveInMinutes = Time.millisToMinute(time.balancedLeave.getMillis());
                                    var nowInMinutes = Time.millisToMinute(Date.now().getMillis());
                                    if ((balancedLeaveInMinutes - nowInMinutes) == minute)
                                        _notify(title, _formatMessage(Strings('noticeBalancedLeave'), minute));
                                }
                            });
                        }
                    });
                });
            },
            _checkMaxDaily = function(title, data) {
                if (_notified)
                    return;

                NOTICE_RANGE_MINUTES.forEach(function(minute) {
                    data.days.forEach(function(day) {
                        if (day.date.isToday()) {
                            day.periods.forEach(function(time) {
                                if (time.out == false)
                                    if ((Settings.MAX_DAILY_MINUTES - minute) == Time.millisToMinute(day.reallyWorked))
                                        _notify(title, _formatMessage(Strings('noticeMaxDaily'), minute));
                            });
                        }
                    });
                });
            },
            _checkMaxConsecutive = function(title, data) {
                if (_notified)
                    return;

                NOTICE_RANGE_MINUTES.forEach(function(minute) {
                    data.days.forEach(function(day) {
                        if (day.date.isToday()) {
                            day.periods.forEach(function(time) {
                                if (time.out == false)
                                    if ((Settings.MAX_CONSECUTIVE_MINUTES - minute) == Time.millisToMinute(time.shift))
                                        _notify(title, _formatMessage(Strings('noticeMaxConsecutive'), minute));
                            });
                        }
                    });
                });
            };


        /* Public Functions */

        return {
            closeFiredOnUnload: _closeFiredOnUnload,
            check: function(data) {
                _notified = false;

                var title = Queiroz.name + " - " + data.date.getTimeAsString();

                _checkMaxConsecutive(title, data);
                _checkMaxDaily(title, data);
                _checkBalancedLeave(title, data);
                _checkWeeklyGoal(title, data);
                _checkDailyGoal(title, data);
            },
            isGranted: function() {
                return Notification && Notification.permission == 'granted';
            },
            requestPermission: function() {
                if (Notification) {
                    Notification.requestPermission().then(Queiroz.reload);
                }
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.notice = Notice;

})(Notification, window.Queiroz);
