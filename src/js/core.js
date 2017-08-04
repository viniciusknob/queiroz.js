
/*!
 * Queiroz.js: core.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        Settings = Queiroz.settings,
        mod      = Queiroz.module,
        Kairos   = mod.kairos,
        View     = mod.view,
        Time     = mod.time,
        Util     = mod.util,
        Snippet  = mod.snippet;

    /* Private Functions */

    var
        _getMaxHoursPerWeekInMillis = function() {
            return Time.hourToMillis(Settings.MAX_HOURS_PER_WEEK);
        },
        _getMaxConsecutiveHoursPerDayInMillis = function() {
            return Time.hourToMillis(Settings.MAX_CONSECUTIVE_HOURS_PER_DAY);
        },
        _getMaxMinutesPerDayInMillis = function() {
            return Time.minuteToMillis(Settings.MAX_MINUTES_PER_DAY);
        };

    var data = {
        week: {
            laborTime: {
                millis: 0, human: '', html: ''
            },
            balanceTime: {
                millis: 0, human: '', html: ''
            },
            pendingTime: {
                millis: 0, human: '', html: ''
            },
            extraTime: {
                millis: 0, human: '', html: ''
            },
            _computePendingTimeInMillis: function() {
                return _getMaxHoursPerWeekInMillis() - this.laborTime.millis;
            },
            _computeExtraTimeInMillis: function() {
                return this.laborTime.millis - _getMaxHoursPerWeekInMillis();
            },
            _buildHumanBalanceTime: function() {
                return Time.millisToHumanWithSign(this.balanceTime.millis);
            },
            buildTime: function() {
                this.pendingTime.millis = this._computePendingTimeInMillis();
                this.extraTime.millis = this._computeExtraTimeInMillis();
            },
            buildHumanTime: function() {
                this.laborTime.human = Time.millisToHuman(this.laborTime.millis);
                this.balanceTime.human = this._buildHumanBalanceTime();
                this.pendingTime.human = Time.millisToHuman(this.pendingTime.millis > 0 ? this.pendingTime.millis : 0);
                this.extraTime.human = Time.millisToHuman(this.extraTime.millis > 0 ? this.extraTime.millis : 0);
            },
            buildHtmlTime: function() {
                this.laborTime.html = Snippet.headerLaborTime(this.laborTime.human);
                this.balanceTime.html = Snippet.headerBalanceTime(this.balanceTime.human);
                this.pendingTime.html = Snippet.headerWeekPendingTime(this.pendingTime.human);
                this.extraTime.html = Snippet.headerExtraTime(this.extraTime.human);
            }
        },
        today: {
            laborTime: {
                millis: 0
            }
        }
    };

    var
        _lastInDate = '',
        _getCheckpoints = function(eDay) {
            return View.getAllCheckpoint(eDay);
        },
        _getDate = function(eDay) {
            return View.getDateFromTargetAsString(eDay);
        },
        _buildTimeToLeave = function() {
            if (data.week.pendingTime.millis <= 0) {
                return '';
            }
            if (data.week.pendingTime.millis > _getMaxMinutesPerDayInMillis()) {
                return '';
            }

            var htmlHumanTimeToLeave = '';
            if (_lastInDate) {
                var timeToLeaveInMillis = _lastInDate.getMillis() + data.week.pendingTime.millis;
                if (!timeToLeaveInMillis || timeToLeaveInMillis < new Date().getMillis()) {
                    return '';
                }

                var humanTimeToLeave = new Date(timeToLeaveInMillis).getTimeAsString();
                htmlHumanTimeToLeave = Snippet.headerWeekTimeToLeave(humanTimeToLeave);
            }
            return htmlHumanTimeToLeave;
        },
        _getPendingOrExtraTime = function() {
            return data.week.pendingTime.millis >= 0 ? data.week.pendingTime.html : data.week.extraTime.html;
        },
        _buildHtmlHeader = function(args) {
            var header = Snippet.header();
            args.forEach(function(element) {
                if (element) {
                    header.appendChild(element);
                }
            });
            return header;
        },
        _renderStats = function() {
            data.week.buildHumanTime();
            data.week.buildHtmlTime();

            var
                htmlLastWeekModeOn = Settings.LAST_WEEK_MODE ? Snippet.headerLastWeekModeOn() : '',
                htmlPendingOrExtraTime = _getPendingOrExtraTime(),
                htmlHumanTimeToLeave = _buildTimeToLeave();

            var
                args = [
                    htmlLastWeekModeOn,
                    data.week.laborTime.html,
                    data.week.balanceTime.html,
                    htmlPendingOrExtraTime,
                    htmlHumanTimeToLeave,
                    Snippet.headerBeta()
                ],
                html = _buildHtmlHeader(args);

            View.appendToHeader(html);
        },
        _buildStats = function() {
            if (Settings.LAST_WEEK_MODE === 'ON') {
                Settings.LAST_WEEK_MODE = 'DOING';
            }

            data.week.buildTime();

            if (Settings.LAST_WEEK_MODE !== 'DOING') {
                _renderStats();
            }
        },
        _renderLaborTimePerShift = function(context, shift, finished) {
            if (shift < 0) shift = 0; // normalize
            var humanMillis = Time.millisToHuman(shift);
            var html = Snippet.laborTimePerShift(humanMillis, finished);
            var container = document.createElement('div');
            container.appendChild(html);
            var filledSlotOut = context.parentNode;
            filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
        },
        _renderLaborTimePerDay = function(eDay, millis) {
            var humanMillis = Time.millisToHuman(millis);
            eDay.appendChild(Snippet.laborTimePerDay(humanMillis));
        },
        _renderBalanceTimePerDay = function(eDay, laborTimeInMillis) {
            var
                isToday = Time.isToday(Time.toDate(_getDate(eDay) + " " + Time.fake)),
                max = _getMaxMinutesPerDayInMillis(),
                millis = 0,
                humanMillis = Time.zero;

            if (laborTimeInMillis < max) {
                millis = max - laborTimeInMillis;
                humanMillis = '-' + Time.millisToHuman(millis);
                if (isToday == false) {
                    data.week.balanceTime.millis -= millis;
                }
            } else if (laborTimeInMillis > max) {
                millis = laborTimeInMillis - max;
                humanMillis = '+' + Time.millisToHuman(millis);
                if (isToday == false) {
                    data.week.balanceTime.millis += millis;
                }
            }
            if (isToday == false) {
              eDay.appendChild(Snippet.balanceTimePerDay(humanMillis));
            }
        },
        _renderTodayBalancedTimeToLeave = function(context, inputMillis) {
            var pendingTime = (_getMaxMinutesPerDayInMillis() - data.today.laborTime.millis) - data.week.balanceTime.millis;
            var timeToLeaveInMillis = inputMillis + (pendingTime < 0 ? 0 : pendingTime);
            var humanTimeToLeave = new Date(timeToLeaveInMillis).getTimeAsString();
            var html = Snippet.todayTimeToLeave(humanTimeToLeave, true);
            var filledSlotOut = context.parentNode;
            filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
        },
        _renderTodayTimeToLeave = function(context, inputMillis) {
            _renderTodayBalancedTimeToLeave(context, inputMillis);

            var pendingTime = _getMaxMinutesPerDayInMillis() - data.today.laborTime.millis;
            var timeToLeaveInMillis = inputMillis + (pendingTime < 0 ? 0 : pendingTime);
            var humanTimeToLeave = new Date(timeToLeaveInMillis).getTimeAsString();
            var html = Snippet.todayTimeToLeave(humanTimeToLeave, false);
            var filledSlotOut = context.parentNode;
            filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
        },
        _analyzeDay = function(eDay) {
            var checkpoints = _getCheckpoints(eDay);
            if (checkpoints.length) {
                var millis = 0;
                View.getAllTimeIn(eDay).forEach(function(inElement, index) {
                    var
                        inText = inElement.textContent, // 15:45
                        inDate = Time.toDate(_getDate(eDay) + " " + inText), // typeOf inDate == Date
                        outElement = checkpoints[(index * 2) + 1];

                    if (outElement && outElement.parentElement.classList.contains('LastSlot') == false) { // TODO
                        var
                            outText = outElement.textContent, // 04:34
                            outDate = Time.toDate(_getDate(eDay) + " " + outText),  // typeOf outDate == Date
                            shiftInMillis = Time.diff(inDate, outDate);

                        millis += shiftInMillis;

                        if (Settings.LAST_WEEK_MODE !== 'DOING') {
                            _renderLaborTimePerShift(outElement, shiftInMillis, true);
                        }
                        if (Time.isToday(inDate)) {
                            data.today.laborTime.millis += shiftInMillis;
                        }
                    } else {
                        _lastInDate = inDate;

                        if (Time.isToday(inDate))
                            if ((_getMaxHoursPerWeekInMillis() - data.week.laborTime.millis) > _getMaxMinutesPerDayInMillis())
                                _renderTodayTimeToLeave(inElement, inDate.getMillis());

                        var diffUntilNow = Time.diff(inDate, new Date());
                        if (diffUntilNow < (_getMaxConsecutiveHoursPerDayInMillis())) {
                            var shiftInMillisUntilNow = millis + diffUntilNow;
                            _renderLaborTimePerShift(inElement, shiftInMillisUntilNow, false);
                        }
                    }
                });
                if (millis > 0) {
                    data.week.laborTime.millis += millis;
                    _renderLaborTimePerDay(eDay, millis);
                }
                _renderBalanceTimePerDay(eDay, millis);
            }
        },
        _selectDaysToAnalyze = function() {
            var
                _selectedDays = [],
                _foundInitialWeekday = false,
                _eDays = View.getAllColumnDay();

            _eDays.forEach(function(eDay) {
                var
                    _stringDay = _getDate(eDay) + " " + Time.fake,
                    _dateDay = Time.toDate(_stringDay);

                if (data.week.laborTime.millis === 0) { // first time
                    if (_foundInitialWeekday || (_foundInitialWeekday = _dateDay.getDay() === Settings.INITIAL_WEEKDAY)) {
                        _selectedDays.push(eDay);
                    }
                } else { // second time
                    if (_dateDay.getDay() === Settings.INITIAL_WEEKDAY) {
                        Settings.LAST_WEEK_MODE = 'DONE';
                    } else {
                        if (Settings.LAST_WEEK_MODE === 'DOING') {
                            _selectedDays.push(eDay);
                        }
                    }
                }
            });
            return _selectedDays;
        },
        _removeLastWeekDays = function(data) {
            var
                targetIndex = 0,
                days = data.days;
            days.forEach(function(day, index) {
                if (day.date.getDay() === Settings.INITIAL_WEEKDAY)
                    targetIndex = index;
            });
            data.days = days.slice(targetIndex);
        },
        _init = function() {
            View.appendToHead(Snippet.style());
            var _selectedDays = _selectDaysToAnalyze();
            _selectedDays.forEach(_analyzeDay);
            _buildStats();

            if (Settings.LAST_WEEK_MODE === 'DOING') {
                Kairos.nextWeek();
                setTimeout(_initWithDelay, 1000);
            }
        },
        _initWithDelay = function() {
            var interval = setInterval(function() {
                if (View.isLoaded()) {
                    clearInterval(interval);
                    _init();
                }
            }, Settings.USERSCRIPT_DELAY_MILLIS);
        };

    /* Public Functions */

    Queiroz.bless = function(lastWeekMode) {
        Settings.LAST_WEEK_MODE = lastWeekMode ? 'ON' : false;
        if (Settings.LAST_WEEK_MODE === 'ON') {
            Kairos.backWeek();
            setTimeout(_initWithDelay, 1000);
        } else {
            if (View.isLoaded()) {
                _init();
            } else {
                _initWithDelay();
            }
        }
        View.appendToFooter(this.description);
        return this.description;
    };

    Queiroz.beta = function() {
        var modal = document.querySelector('.qz-modal');
        if (modal) {
            modal.classList.remove('js-hide');
            modal.classList.add('js-show');
            return;
        }
        /*
        var data = View.collectData();
        Time.transformToDate(data);
        _removeLastWeekDays(data);
        Time.computeTimes(data);
        Time.transformToHuman(data);
        */
        View.appendToBody('__modal__', function() {
            document.querySelector(".qz-modal-close").onclick = function() {
                if (!modal) {
                    modal = document.querySelector('.qz-modal');
                }
                modal.classList.remove('js-show');
                modal.classList.add('js-hide');
            };
        });
    };

})(Queiroz);
