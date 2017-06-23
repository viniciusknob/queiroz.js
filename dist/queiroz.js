
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Constants */

    var
        NAME = 'snippet',

        TagName = {
            DIV: 'div',
            P: 'p',
            SPAN: 'span',
            STRONG: 'strong'
        };


    /* Module Definition */

    var Snippet = function() {

        /* PRIVATE */

        var
            _buildTag = function(name, clazz, text) {
                var element = document.createElement(name);
                if (clazz) {
                    element.className = clazz;
                }
                if (text) {
                    var textNode = document.createTextNode(text);
                    element.appendChild(textNode);
                }
                return element;
            },
            _buildBoxHeader = function(boxContent, strongValue, strongClass) {
                var box = _buildTag(TagName.SPAN, 'qz-box qz-box-muted', boxContent);
                var time = _buildTag(TagName.STRONG, strongClass, strongValue);
                box.appendChild(time);
                return box;
            };

        /* PUBLIC */

        return {
            STYLE: '<style>strong{font-weight:700}#SemanaApontamentos{cursor:default!important}.ContentTable{margin-top:inherit}.FilledSlot,.LastSlot,.emptySlot{height:inherit;padding:5px}.FilledSlot span{margin:inherit!important}.qz-text-primary{color:brown}.qz-text-golden{color:#b8860b}.qz-text-green{color:green}.qz-text-teal{color:teal}.qz-box{padding:5px 10px;margin:5px 1px;border:#a9a9a9 1px solid}.qz-box-head{float:right;padding:10px 0}.qz-box-muted{background-color:#d3d3d3}.qz-box .qz-box-content{vertical-align:middle}.qz-help-text{font-size:10px}</style>',
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLastWeekModeOn: function() {
                return _buildBoxHeader('', 'SEMANA ANTERIOR', 'qz-text-primary');
            },
            headerLaborTime: function(laborTime) {
                return _buildBoxHeader('Efetuado: ', laborTime, 'qz-text-green');
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBoxHeader('Saldo: ', balanceTime, 'qz-text-teal');
            },
            headerWeekPendingTime: function(pendingTime) {
                return _buildBoxHeader('Pendente: ', pendingTime, 'qz-text-primary');
            },
            headerExtraTime: function(extraTime) {
                return _buildBoxHeader('Extra: ', extraTime, 'qz-text-green');
            },
            headerWeekTimeToLeave: function(timeToLeave) {
                return _buildBoxHeader('Saída: ', timeToLeave, 'qz-text-primary');
            },
            balanceTimePerDay: function(balanceTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Saldo');
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-teal', balanceTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerDay: function(laborTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Efetuado');
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-green', laborTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerShift: function(laborTime, finished) {
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                var time = _buildTag(TagName.STRONG, 'qz-box-content', laborTime);
                if (!finished) {
                    var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Trabalhando...');
                    div.appendChild(helpText);
                    time.classList.add('qz-text-golden');
                }
                div.appendChild(time);
                return div;
            },
            todayTimeToLeave: function(timeToLeave) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Saída');
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-primary', timeToLeave);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            }
        };
    }();

    window[NAME] = Snippet;

})(window);

/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Constants */

    var NAME = 'view';


    /* Module Definition */

    var View = function() {

        /* PUBLIC */

        return {
            append: function(selector, html) {
                var _this = this;
                _this.asyncReflow(function() {
                    var
                        element = _this.get(selector),
                        container = document.createElement('div');

                    if (typeof html === 'string') {
                        container.innerHTML = html;
                    } else {
                        container.appendChild(html);
                    }

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
    }();

    window[NAME] = View;

})(window);

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
            _normalize = function(number) {
                return (number < 10 ? '0' + number : number);
            },
            _Hour = (function() {
                return {
                    toMillis: function(hour) {
                        return hour * _Millis.IN_HOUR;
                    }
                };
            })(),
            _Minute = (function() {
                return {
                    toMillis: function(minute) {
                        return minute * _Millis.IN_MINUTE;
                    }
                };
            })(),
            _Millis = (function() {

                var
                    MINUTE_IN_MILLIS = 1000 * 60,
                    HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60;

                /* PUBLIC */

                return {
                    IN_MINUTE: MINUTE_IN_MILLIS,
                    IN_HOUR: HOUR_IN_MILLIS,
                    diff: function(init, end) {
                        if (init instanceof Date && end instanceof Date) {
                            return end.getTime() - init.getTime();
                        } else {
                            return end - init;
                        }
                    },
                    toHumanTime: function(millis) {
                        var
                            diffHour = parseInt(millis / HOUR_IN_MILLIS),
                            diffMin = parseInt((millis / MINUTE_IN_MILLIS) % 60);

                        return _normalize(diffHour) + ':' + _normalize(diffMin);
                    }
                };
            })();

        /* PUBLIC */

        return {
            Hour: _Hour,
            Minute: _Minute,
            Millis: _Millis,
            Weekday: Weekday,
            dateToHumanTime: function(date) {
                return _normalize(date.getHours()) + ':' + _normalize(date.getMinutes());
            },
            fake: '12:34',
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
            zero: '00:00'
        };
    }();

    window[NAME] = Time;

})(window);

/*!
 * Queiroz.js: util.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Constants */

    var NAME = 'util';


    /* Module Definition */

    var Util = function() {

        /* PUBLIC */

        return {
            textFormat: function(pattern, args) {
                for (var index = 0; index < args.length; index++) {
                    var regex = new RegExp('\\{' + index + '\\}', 'g');
                    pattern = pattern.replace(regex, args[index]);
                }
                return pattern;
            }
        };
    }();

    window[NAME] = Util;

})(window);

/*!
 * Queiroz.js: main.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, View, Time, Util, Snippet) {

    /* Constants */

    var NAME = 'QueirozJS';


    /* Module Definition */

    var Queiroz = function() {

        /* CONSTANTS */

        var
            _NAME = 'Queiroz.js',
            VERSION = '2.7.15',

            Settings = {
                INITIAL_WEEKDAY: Time.Weekday.MONDAY,
                LAST_WEEK_MODE: false, // false, ON, DOING, DONE
                MAX_CONSECUTIVE_HOURS_PER_DAY: 6,
                MAX_HOURS_PER_WEEK: 44,
                MAX_MINUTES_PER_DAY: (8 * 60) + 48,
                USERSCRIPT_DELAY_MILLIS: 1000
            },

            Selector = {
                COLUMN_DAY: '.DiaApontamento',
                CHECKPOINT: '.FilledSlot span',
                DATE: '[id^=hiddenDiaApont]',
                HEADER: '#SemanaApontamentos div',
                TIME_IN: '.TimeIN,.TimeINVisualizacao'
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
                    var millis = this.balanceTime.millis;
                    if (millis == 0) {
                        return Time.zero;
                    } else if (millis > 0) {
                        return '+' + Time.Millis.toHumanTime(millis);
                    } else if (millis < 0) {
                        return '-' + Time.Millis.toHumanTime(millis * -1);
                    }
                },
                buildTime: function() {
                    this.pendingTime.millis = this._computePendingTimeInMillis();
                    this.extraTime.millis = this._computeExtraTimeInMillis();
                },
                buildHumanTime: function() {
                    this.laborTime.human = Time.Millis.toHumanTime(this.laborTime.millis);
                    this.balanceTime.human = this._buildHumanBalanceTime();
                    this.pendingTime.human = Time.Millis.toHumanTime(this.pendingTime.millis > 0 ? this.pendingTime.millis : 0);
                    this.extraTime.human = Time.Millis.toHumanTime(this.extraTime.millis > 0 ? this.extraTime.millis : 0);
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
                return View.getAll(Selector.CHECKPOINT, eDay);
            },
            _getDate = function(eDay) {
                return View.get(Selector.DATE, eDay).value;
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
                    var timeToLeaveInMillis = _lastInDate.getTime() + data.week.pendingTime.millis;
                    if (!timeToLeaveInMillis || timeToLeaveInMillis < new Date().getTime()) {
                        return '';
                    }

                    var humanTimeToLeave = Time.dateToHumanTime(new Date(timeToLeaveInMillis));
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
                        htmlHumanTimeToLeave
                    ],
                    html = _buildHtmlHeader(args);

                View.append(Selector.HEADER, html);
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
                var humanMillis = Time.Millis.toHumanTime(shift);
                var html = Snippet.laborTimePerShift(humanMillis, finished);
                var container = document.createElement('div');
                container.appendChild(html);
                var filledSlotOut = context.parentNode;
                filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
            },
            _renderLaborTimePerDay = function(eDay, millis) {
                var humanMillis = Time.Millis.toHumanTime(millis);
                eDay.appendChild(Snippet.laborTimePerDay(humanMillis));
            },
            _renderBalanceTimePerDay = function(eDay, laborTimeInMillis) {
                var
                    max = _getMaxMinutesPerDayInMillis(),
                    millis = 0,
                    humanMillis = Time.zero;

                if (laborTimeInMillis < max) {
                    millis = max - laborTimeInMillis;
                    humanMillis = '-' + Time.Millis.toHumanTime(millis);
                    if (Time.isToday(Time.toDate(_getDate(eDay) + " " + Time.fake)) == false) {
                        data.week.balanceTime.millis -= millis;
                    }
                } else if (laborTimeInMillis > max) {
                    millis = laborTimeInMillis - max;
                    humanMillis = '+' + Time.Millis.toHumanTime(millis);
                    if (Time.isToday(Time.toDate(_getDate(eDay) + " " + Time.fake)) == false) {
                        data.week.balanceTime.millis += millis;
                    }
                }
                eDay.appendChild(Snippet.balanceTimePerDay(humanMillis));
            },
            _renderTodayTimeToLeave = function(context, inputMillis) {
                var pendingTime = _getMaxMinutesPerDayInMillis() - data.today.laborTime.millis;
                var timeToLeaveInMillis = inputMillis + (pendingTime < 0 ? 0 : pendingTime);
                var humanTimeToLeave = Time.dateToHumanTime(new Date(timeToLeaveInMillis));
                var html = Snippet.todayTimeToLeave(humanTimeToLeave);
                var filledSlotOut = context.parentNode;
                filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
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
                                _renderLaborTimePerShift(outElement, shiftInMillis, true);
                            }
                            if (Time.isToday(inDate)) {
                                data.today.laborTime.millis += shiftInMillis;
                            }
                        } else {
                            _lastInDate = inDate;
                            if (Time.isToday(inDate) && ((_getMaxHoursPerWeekInMillis() - data.week.laborTime.millis) > _getMaxMinutesPerDayInMillis())) {
                                _renderTodayTimeToLeave(inElement, inDate.getTime());
                            }
                            var diffUntilNow = Time.Millis.diff(inDate, new Date());
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
                    _eDays = View.getAll(Selector.COLUMN_DAY);

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
                }, Settings.USERSCRIPT_DELAY_MILLIS);
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

})(window, view, time, util, snippet);

/*!
 * Queiroz.js: autoexec.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

QueirozJS.bless();