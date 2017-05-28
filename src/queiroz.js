/*!
 * Queiroz.js 2.4.1 | JavaScript Extension for Dimep Kairos
 */
var

    /**
     * ------------------------------------------------------------------------
     * Queiroz.js
     * ------------------------------------------------------------------------
     */
    Queiroz = (function() {

        /* UTILS */

        var Util = (function() {

            var
                /**
                 * ------------------------------------------------------------------------
                 * TextFormatter
                 * ------------------------------------------------------------------------
                 */
                _TextFormatter = (function() {

                    /* PUBLIC */

                    return {
                        format: function(pattern, args) {
                            for (var index = 0; index < args.length; index++) {
                                var regex = new RegExp('\\{' + index + '\\}', 'g');
                                pattern = pattern.replace(regex, args[index]);
                            }
                            return pattern;
                        }
                    };
                })(),

                /**
                 * ------------------------------------------------------------------------
                 * Time
                 * ------------------------------------------------------------------------
                 */
                _Time = (function() {

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

                            var
                                _In = {
                                    MINUTE: 1000 * 60,
                                    HOUR: 1000 * 60 * 60
                                };

                            /* PUBLIC */

                            return {
                                diff: function(init, end) {
                                    if (init instanceof Date && end instanceof Date) {
                                        return end.getTime() - init.getTime();
                                    } else {
                                        return end - init;
                                    }
                                },
                                In: _In
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
                })(),

                /**
                 * ------------------------------------------------------------------------
                 * TimeFormatter
                 * ------------------------------------------------------------------------
                 */
                _TimeFormatter = (function(Time) {

                    var
                        _normalize = function(number) {
                            return (number < 10 ? '0' + number : number);
                        };

                    /* PUBLIC */

                    return {
                        dateToHumanTime: function(date) {
                            return _normalize(date.getHours()) + ':' + _normalize(date.getMinutes());
                        },
                        millisToHumanTime: function(millis) {
                            var
                                diffHour = parseInt(millis / Time.Millis.In.HOUR),
                                diffMin = parseInt((millis / Time.Millis.In.MINUTE) % 60);

                            return _normalize(diffHour) + ':' + _normalize(diffMin);
                        }
                    };
                })(_Time),

                /**
                 * ------------------------------------------------------------------------
                 * View
                 * ------------------------------------------------------------------------
                 */
                _View = (function() {

                    /* PUBLIC */

                    return {
                        append: function(selector, html) {
                            var _this = this;
                            _this.asyncReflow(function() {
                                var
                                    element = _this.get(selector),
                                    container = document.createElement('div');
                                container.innerHTML = html;
                                element.appendChild(container);
                            });
                        },
                        asyncReflow: function(task) {
                            setTimeout(task, 25);
                        },
                        get: function(selector, target) {
                            return (target || document).querySelector(selector);
                        },
                        getAll: function(selector, target) {
                            return (target || document).querySelectorAll(selector);
                        }
                    };
                })();

            return {
                TextFormatter: _TextFormatter,
                Time: _Time,
                TimeFormatter: _TimeFormatter,
                View: _View
            };
        })();

        /* CONSTANTS */

        var
            NAME = 'Queiroz.js',
            VERSION = '2.4.1',

            Settings = {
                INITIAL_WEEKDAY: Util.Time.Weekday.MONDAY,
                LAST_WEEK_MODE: false, // false, ON, DOING, DONE
                MAX_HOURS_PER_DAY: 6,
                MAX_HOURS_PER_WEEK: 44,
                NORMAL_MINUTES_PER_DAY: (8 * 60) + 48,
                TAMPERMONKEY_DELAY_MILLIS: 1000
            },

            Selector = {
                COLUMN_DAY: '.DiaApontamento',
                CHECKPOINT: '.FilledSlot span',
                DATE: '[id^=hiddenDiaApont]',
                HEADER: '#SemanaApontamentos div',
                TIME_IN: '.TimeIN,.TimeINVisualizacao'
            },

            Snippet = {
                HEADER: '<p class="floatRight" style="padding: 10px; background-color: lightgray;">{0}{1}{2}{3}</p>',
                HEADER_LAST_WEEK_MODE_ON: '<span class="bold" style="color: green;">SEMANA ANTERIOR</span>  |  ',
                HEADER_LABOR_TIME: 'Total: <span class="bold" style="color: brown;">{0}</span>',
                HEADER_MISSING_TIME: '  |  Faltam: <span class="bold" style="color: brown;">{0}</span>',
                HEADER_TIME_TO_LEAVE: '  |  Saída/Fim: <span class="bold" style="color: brown;">{0}</span>',
                LABOR_TIME_PER_DAY: '' +
                    '<div class="FilledSlot" style="background-color: lightgray; padding-top: 5px; margin-bottom: 10px;">' +
                        '<span class="bold" style="margin-left: 6px; color: brown; vertical-align: middle;">= {0}</span>' +
                    '</div>',
                LABOR_TIME_PER_SHIFT: '' +
                    '<div class="FilledSlot" style="background-color: lightgray; padding-top: 5px; margin-bottom: 10px;">' +
                        '<span class="bold" style="margin-left: 6px; vertical-align: middle;">{0}</span>' +
                    '</div>'
            };

        /* PRIVATE */

        var
            _larborTimeInMillis = 0,
            _lastIn = '',
            _computeMaxHoursPerWeekInMillis = function() {
                return Settings.MAX_HOURS_PER_WEEK * Util.Time.Millis.In.HOUR;
            },
            _computeMissingTimeInMillis = function() {
                return _computeMaxHoursPerWeekInMillis() - _larborTimeInMillis;
            },
            _getCheckpoints = function(eColumnDay) {
                return Util.View.getAll(Selector.CHECKPOINT, eColumnDay);
            },
            _getDate = function(eColumnDay) {
                return Util.View.get(Selector.DATE, eColumnDay).value;
            },
            _getMaxHoursPerDayInMillis = function() {
                return Util.Time.Hour.toMillis(Settings.MAX_HOURS_PER_DAY);
            },
            _getNormalMinutesPerDayInMillis = function() {
                return Util.Time.Minute.toMillis(Settings.NORMAL_MINUTES_PER_DAY);
            },
            _buildTimeToLeave = function(missingTimeInMillis) {
                if (missingTimeInMillis <= 0) {
                    return '';
                }
                if (missingTimeInMillis > _getNormalMinutesPerDayInMillis()) {
                    return '';
                }

                var htmlHumanTimeToLeave = '';
                if (_lastIn) {
                    var timeToLeaveInMillis = _lastIn.getTime() + missingTimeInMillis;
                    if (!timeToLeaveInMillis || timeToLeaveInMillis < new Date().getTime()) {
                        return '';
                    }

                    var humanTimeToLeave = Util.TimeFormatter.dateToHumanTime(new Date(timeToLeaveInMillis));
                    htmlHumanTimeToLeave = Util.TextFormatter.format(Snippet.HEADER_TIME_TO_LEAVE, [humanTimeToLeave]);
                }
                return htmlHumanTimeToLeave;
            },
            _renderStats = function(missingTimeInMillis, humanLaborTime, humanMissingTime) {
                var
                    htmlLastWeekModeOn = Settings.LAST_WEEK_MODE ? Snippet.HEADER_LAST_WEEK_MODE_ON : '',
                    htmlHumanLaborTime = Util.TextFormatter.format(Snippet.HEADER_LABOR_TIME, [humanLaborTime]),
                    htmlHumanMissingTime = Util.TextFormatter.format(Snippet.HEADER_MISSING_TIME, [humanMissingTime]),
                    htmlHumanTimeToLeave = _buildTimeToLeave(missingTimeInMillis);

                var
                    args = [
                        htmlLastWeekModeOn,
                        htmlHumanLaborTime,
                        htmlHumanMissingTime,
                        htmlHumanTimeToLeave
                    ],
                    html = Util.TextFormatter.format(Snippet.HEADER, args);

                Util.View.append(Selector.HEADER, html);
            },
            _buildStats = function() {
                if (Settings.LAST_WEEK_MODE === 'ON') {
                    Settings.LAST_WEEK_MODE = 'DOING';
                }

                var
                    missingTimeInMillis = _computeMissingTimeInMillis(),
                    humanLaborTime = Util.TimeFormatter.millisToHumanTime(_larborTimeInMillis),
                    humanMissingTime = Util.TimeFormatter.millisToHumanTime(missingTimeInMillis > 0 ? missingTimeInMillis : 0);

                if (Settings.LAST_WEEK_MODE !== 'DOING') {
                    _renderStats(missingTimeInMillis, humanLaborTime, humanMissingTime);
                }
            },
            _renderLaborTimePerShift = function(context, shift) {
                var humanMillis = Util.TimeFormatter.millisToHumanTime(shift);
                var html = Util.TextFormatter.format(Snippet.LABOR_TIME_PER_SHIFT, [humanMillis]);
                var container = document.createElement('div');
                container.innerHTML = html;
                var filledSlotOut = context.parentNode;
                filledSlotOut.parentNode.insertBefore(container, filledSlotOut.nextSibling);
                return container;
            },
            _renderLaborTime = function(eDay, millis) {
                var humanMillis = Util.TimeFormatter.millisToHumanTime(millis);
                eDay.innerHTML += Util.TextFormatter.format(Snippet.LABOR_TIME_PER_DAY, [humanMillis]);
            },
            _analyzeDay = function(eDay) {
                var checkpoints = _getCheckpoints(eDay);
                if (checkpoints.length) {
                    var millis = 0;

                    Util.View.getAll(Selector.TIME_IN, eDay).forEach(function(eIn, index) {
                        var
                            timeIn = eIn.textContent, // 15:45
                            enter = Util.Time.toDate(_getDate(eDay) + " " + timeIn),
                            eOut = checkpoints[(index * 2) + 1];

                        if (eOut && !eOut.parentElement.classList.contains('LastSlot')) { // TODO
                            var
                                timeOut = eOut.textContent, // 04:34
                                exit = Util.Time.toDate(_getDate(eDay) + " " + timeOut),
                                shift = Util.Time.Millis.diff(enter, exit);

                            millis += shift;

                            if (Settings.LAST_WEEK_MODE !== 'DOING') {
                                _renderLaborTimePerShift(eOut, shift);
                            }
                        } else {
                            _lastIn = enter;
                            var diffUntilNow = Util.Time.Millis.diff(enter, new Date());
                            if (diffUntilNow < (_getMaxHoursPerDayInMillis())) {
                                var
                                    shift = millis + diffUntilNow,
                                    element = _renderLaborTimePerShift(eIn, shift),
                                    span = element.querySelector('span');
                                element.style.color = 'darkgoldenrod';
                                span.textContent = '~ ' + span.textContent;
                            }
                        }
                    });
                    _renderLaborTime(eDay, millis);
                    _larborTimeInMillis += millis;
                }
            },
            _selectDaysToAnalyze = function() {
                var
                    _selectedDays = [],
                    _foundInitialWeekday = false,
                    _fakeTime = '12:34',
                    _eDays = Util.View.getAll(Selector.COLUMN_DAY);

                _eDays.forEach(function(eDay) {
                    var
                        _stringDay = _getDate(eDay) + " " + _fakeTime,
                        _dateDay = Util.Time.toDate(_stringDay);

                    if (_larborTimeInMillis === 0) { // first time
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
            _resetControls = function() {
                _larborTimeInMillis = 0;
                _lastIn = '';
            },
            _init = function() {
                var _selectedDays = _selectDaysToAnalyze();
                _selectedDays.forEach(_analyzeDay);
                _buildStats();

                if (Settings.LAST_WEEK_MODE === 'DOING') {
                    mudarSemana(1, true);
                    setTimeout(_initWithDelay, 1000);
                }
            },
            _initWithDelay = function() {
                var interval = setInterval(function() {
                    if (Util.View.get(Selector.CHECKPOINT)) {
                        clearInterval(interval);
                        _init();
                    }
                }, Settings.TAMPERMONKEY_DELAY_MILLIS);
            };

        /* PUBLIC */

        return {
            bless: function(lastWeekMode) {
                Settings.LAST_WEEK_MODE = lastWeekMode ? 'ON' : false;
                if (Settings.LAST_WEEK_MODE === 'ON') {
                    mudarSemana(-1, true);
                    setTimeout(_initWithDelay, 1000);
                } else {
                    if (Util.View.get(Selector.CHECKPOINT)) {
                        _init();
                    } else {
                        _initWithDelay();
                    }
                }
                return NAME + ' ' + VERSION;
            },
            name: NAME,
            version: VERSION
        };
    })();

Queiroz.bless();