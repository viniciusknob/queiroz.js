
/*!
 * Queiroz.js: main.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, View, Time, Util) {

    /* Constants */

    var NAME = 'Queiroz';


    /* Module Definition */

    var Queiroz = function() {

        /* CONSTANTS */

        var
            _NAME = 'Queiroz.js',
            VERSION = '0.0.0',

            Settings = {
                INITIAL_WEEKDAY: Time.Weekday.MONDAY,
                LAST_WEEK_MODE: false, // false, ON, DOING, DONE
                MAX_CONSECUTIVE_HOURS_PER_DAY: 6,
                MAX_HOURS_PER_WEEK: 44,
                MAX_MINUTES_PER_DAY: (8 * 60) + 48,
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
                HEADER: '<p class="qz-box qz-box-head qz-box-muted">{0}{1}{2}{3}{4}</p>',
                HEADER_LAST_WEEK_MODE_ON: '<strong class="qz-text-primary">SEMANA ANTERIOR</strong>  |  ',
                HEADER_LABOR_TIME: 'Total: <strong class="qz-text-primary">{0}</strong>',
                HEADER_TODAY_MISSING_TIME: '  |  Faltam/Hoje: <strong class="qz-text-primary">{0}</strong>',
                HEADER_WEEK_MISSING_TIME: '  |  Faltam/Semana: <strong class="qz-text-primary">{0}</strong>',
                HEADER_EXTRA_TIME: '  |  Extra: <strong class="qz-text-primary">{0}</strong>',
                HEADER_TIME_TO_LEAVE: '  |  Saída/Fim: <strong class="qz-text-primary">{0}</strong>',
                LABOR_TIME_PER_DAY: '' +
                    '<div class="qz-box qz-box-muted">' +
                        '<strong class="qz-box-content qz-text-primary">{0}</strong>' +
                    '</div>',
                LABOR_TIME_PER_SHIFT: '' +
                    '<div class="qz-box qz-box-muted">' +
                        '<strong class="qz-box-content">{0}</strong>' +
                    '</div>',
                STYLE: ''+
                    '<style>' +
                        // reset
                        'strong{font-weight:bold;}' +
                        // override
                        '.ContentTable {margin-top:inherit;}' +
                        '.emptySlot,.FilledSlot,.LastSlot {height:inherit;padding:5px;}' +
                        // queiroz.js classes
                        '.qz-text-primary {color:brown;}' +
                        '.qz-box {padding:7px;margin:5px 1px;}' +
                        '.qz-box-head {float:right;padding:10px;}' +
                        '.qz-box-muted {background-color:lightgray;}' +
                        '.qz-box .qz-box-content {margin-left:6px; vertical-align:middle;}' +
                    '</style>'
            };

        /* PRIVATE */

        var
            _getMaxHoursPerWeekInMillis = function() {
                return Time.Hour.toMillis(Settings.MAX_HOURS_PER_WEEK);
            },
            _getMaxConsecutiveHoursPerDayInMillis = function() {
                return Time.Hour.toMillis(Settings.MAX_CONSECUTIVE_HOURS_PER_DAY);
            },
            _getMaxMinutesPerDayInMillis = function() {
                return Time.Minute.toMillis(Settings.MAX_MINUTES_PER_DAY);
            };


        var data = {
            week: {
                laborTime: {
                    millis: 0, human: '', html: ''
                },
                missingTime: {
                    millis: 0, human: '', html: ''
                },
                extraTime: {
                    millis: 0, human: '', html: ''
                },
                _computeMissingTimeInMillis: function() {
                    return _getMaxHoursPerWeekInMillis() - this.laborTime.millis;
                },
                _computeExtraTimeInMillis: function() {
                    return this.laborTime.millis - _getMaxHoursPerWeekInMillis();
                },
                buildTime: function() {
                    this.missingTime.millis = this._computeMissingTimeInMillis();
                    this.extraTime.millis = this._computeExtraTimeInMillis();
                },
                buildHumanTime: function() {
                    this.laborTime.human = Time.Millis.toHumanTime(this.laborTime.millis);
                    this.missingTime.human = Time.Millis.toHumanTime(this.missingTime.millis > 0 ? this.missingTime.millis : 0);
                    this.extraTime.human = Time.Millis.toHumanTime(this.extraTime.millis > 0 ? this.extraTime.millis : 0);
                },
                buildHtmlTime: function() {
                    this.laborTime.html = Util.textFormat(Snippet.HEADER_LABOR_TIME, [this.laborTime.human]);
                    this.missingTime.html = Util.textFormat(Snippet.HEADER_WEEK_MISSING_TIME, [this.missingTime.human]);
                    this.extraTime.html = Util.textFormat(Snippet.HEADER_EXTRA_TIME, [this.extraTime.human]);
                }
            },
            today: {
                laborTime: {
                    millis: 0
                },
                missingTime: {
                    millis: 0, human: '', html: ''
                },
                _computeMissingTimeInMillis: function() {
                    return _getMaxMinutesPerDayInMillis() - this.laborTime.millis;
                },
                buildTime: function() {
                    this.missingTime.millis = this._computeMissingTimeInMillis();
                },
                buildHumanTime: function() {
                    this.missingTime.human = Time.Millis.toHumanTime(this.missingTime.millis > 0 ? this.missingTime.millis : 0);
                },
                buildHtmlTime: function() {
                    this.missingTime.html = Util.textFormat(Snippet.HEADER_TODAY_MISSING_TIME, [this.missingTime.human]);
                }
            }
        };

        var
            _lastInDate = '',
            _getCheckpoints = function(eColumnDay) {
                return View.getAll(Selector.CHECKPOINT, eColumnDay);
            },
            _getDate = function(eColumnDay) {
                return View.get(Selector.DATE, eColumnDay).value;
            },
            _buildTimeToLeave = function() {
                if (data.week.missingTime.millis <= 0) {
                    return '';
                }
                if (data.week.missingTime.millis > _getMaxMinutesPerDayInMillis()) {
                    return '';
                }

                var htmlHumanTimeToLeave = '';
                if (_lastInDate) {
                    var timeToLeaveInMillis = _lastInDate.getTime() + data.week.missingTime.millis;
                    if (!timeToLeaveInMillis || timeToLeaveInMillis < new Date().getTime()) {
                        return '';
                    }

                    var humanTimeToLeave = Time.dateToHumanTime(new Date(timeToLeaveInMillis));
                    htmlHumanTimeToLeave = Util.textFormat(Snippet.HEADER_TIME_TO_LEAVE, [humanTimeToLeave]);
                }
                return htmlHumanTimeToLeave;
            },
            _renderStats = function() {
                data.week.buildHumanTime();
                data.week.buildHtmlTime();
                data.today.buildHumanTime();
                data.today.buildHtmlTime();

                var
                    htmlLastWeekModeOn = Settings.LAST_WEEK_MODE ? Snippet.HEADER_LAST_WEEK_MODE_ON : '',
                    htmlHumanTimeToLeave = _buildTimeToLeave(data.week.missingTime.millis);

                var
                    args = [
                        htmlLastWeekModeOn,
                        data.week.laborTime.html,
                        data.today.missingTime.html,
                        (data.week.missingTime.millis >= 0 ? data.week.missingTime.html : data.week.extraTime.html),
                        htmlHumanTimeToLeave
                    ],
                    html = Util.textFormat(Snippet.HEADER, args);

                View.append(Selector.HEADER, html);
            },
            _buildStats = function() {
                if (Settings.LAST_WEEK_MODE === 'ON') {
                    Settings.LAST_WEEK_MODE = 'DOING';
                }

                data.week.buildTime();
                data.today.buildTime();

                if (Settings.LAST_WEEK_MODE !== 'DOING') {
                    _renderStats();
                }
            },
            _renderLaborTimePerShift = function(context, shift) {
                var humanMillis = Time.Millis.toHumanTime(shift);
                var html = Util.textFormat(Snippet.LABOR_TIME_PER_SHIFT, [humanMillis]);
                var container = document.createElement('div');
                container.innerHTML = html;
                var filledSlotOut = context.parentNode;
                filledSlotOut.parentNode.insertBefore(container, filledSlotOut.nextSibling);
                return container;
            },
            _renderLaborTimePerDay = function(eDay, millis) {
                var humanMillis = Time.Millis.toHumanTime(millis);
                eDay.innerHTML += Util.textFormat(Snippet.LABOR_TIME_PER_DAY, [humanMillis]);
            },
            _analyzeDay = function(eDay) {
                var checkpoints = _getCheckpoints(eDay);
                if (checkpoints.length) {
                    var millis = 0;
                    View.getAll(Selector.TIME_IN, eDay).forEach(function(inElement, index) {
                        var
                            inText = inElement.textContent, // 15:45
                            inDate = Time.toDate(_getDate(eDay) + " " + inText), // typeOf inDate == Date
                            outElement = checkpoints[(index * 2) + 1];

                        if (outElement && !outElement.parentElement.classList.contains('LastSlot')) { // TODO
                            var
                                outText = outElement.textContent, // 04:34
                                outDate = Time.toDate(_getDate(eDay) + " " + outText),  // typeOf outDate == Date
                                shiftInMillis = Time.Millis.diff(inDate, outDate);

                            millis += shiftInMillis;

                            if (Settings.LAST_WEEK_MODE !== 'DOING') {
                                _renderLaborTimePerShift(outElement, shiftInMillis);
                            }
                            if (Time.isToday(inDate)) {
                                data.today.laborTime.millis += shiftInMillis;
                            }
                        } else {
                            _lastInDate = inDate;
                            var diffUntilNow = Time.Millis.diff(inDate, new Date());
                            if (diffUntilNow < (_getMaxConsecutiveHoursPerDayInMillis())) {

                                var
                                    shiftInMillis = millis + diffUntilNow,
                                    element = _renderLaborTimePerShift(inElement, shiftInMillis),
                                    span = element.querySelector('strong');

                                element.style.color = 'darkgoldenrod';
                                span.textContent = '~ ' + span.textContent;
                            }
                        }
                    });
                    data.week.laborTime.millis += millis;
                    _renderLaborTimePerDay(eDay, millis);
                }
            },
            _selectDaysToAnalyze = function() {
                var
                    _selectedDays = [],
                    _foundInitialWeekday = false,
                    _fakeTime = '12:34',
                    _eDays = View.getAll(Selector.COLUMN_DAY);

                _eDays.forEach(function(eDay) {
                    var
                        _stringDay = _getDate(eDay) + " " + _fakeTime,
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
            _init = function() {
                View.append('head', Snippet.STYLE);
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
                    if (View.get(Selector.CHECKPOINT)) {
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
                    if (View.get(Selector.CHECKPOINT)) {
                        _init();
                    } else {
                        _initWithDelay();
                    }
                }
                return _NAME + ' ' + VERSION;
            },
            name: _NAME,
            version: VERSION
        };
    }();

    window[NAME] = Queiroz;

})(window, view, time, util);