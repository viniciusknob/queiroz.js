
/*!
 * Queiroz.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Class Definition */

    var Queiroz = function() {

        /* Constants */

        var
            NAME = 'Queiroz.js',
            VERSION = '2.9.5',

            Settings = {
                USERSCRIPT_DELAY_MILLIS: 1000,
                MAX_CONSECUTIVE_HOURS_PER_DAY: 6,
                MAX_HOURS_PER_WEEK: 44,
                MAX_MINUTES_PER_DAY: (8 * 60) + 48,
                // Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6
                INITIAL_WEEKDAY: 1,
                // false, ON, DOING, DONE
                LAST_WEEK_MODE: false
            };

        /* Public Functions */

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          module: {},
          settings: Settings
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);


/*!
 * Queiroz.js: kairos.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Class Definition */

    var Kairos = function() {
        return {
            backWeek: function() {
              window.mudarSemana(-1, true);
            },
            nextWeek: function() {
              window.mudarSemana(1, true);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.kairos = Kairos;

})(window, Queiroz);


/*!
 * Queiroz.js: strings.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz, Resource) {

    /* Class Definition */

    var Strings = function(key) {
        return Strings._[key];
    };

    Strings._ = Resource;

    /* Module Definition */

    Queiroz.module.strings = Strings;

})(Queiroz, {
    "hLastWeek" : "SEMANA PASSADA",
    "hLabor" : "Efetuado: ",
    "hBalance" : "Saldo: ",
    "hPending" : "Pendente: ",
    "hExtra" : "Extra: ",
    "balance" : "Saldo",
    "labor" : "Efetuado",
    "working" : "Trabalhando...",
    "exit" : "Saída (08:48)",
    "balancedExit" : "Saída + Saldo"
}
);


/*!
 * Queiroz.js: style.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Style = function() {
        return {
            CSS: 'html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}#SemanaApontamentos{cursor:default!important}.ContentTable{margin-top:inherit}.FilledSlot,.LastSlot,.emptySlot{height:inherit;padding:5px}.FilledSlot span{margin:inherit!important}.qz-text-center{text-align:center}.qz-text-primary{color:brown}.qz-text-golden{color:#b8860b}.qz-text-green{color:green}.qz-text-teal{color:teal}.qz-box{padding:5px 10px;margin:5px 1px;border:#a9a9a9 1px solid}.qz-box-head{float:right;padding:10px 0}.qz-box-muted{background-color:#d3d3d3}.qz-box .qz-box-content{vertical-align:middle}.qz-help-text{font-size:10px}.js-show{display:block}.js-hide{display:none}.qz-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1024;background-color:rgba(0,0,0,.5)}.qz-modal-dialog{position:relative;width:900px;margin:30px auto}.qz-modal-content{position:relative;background-color:#fff;background-clip:padding-box;border-radius:5px}.qz-modal-header{padding:10px;border-bottom:1px solid #d3d3d3;font-weight:700;font-size:16px}.qz-modal-close{float:right;cursor:pointer;background:0 0;border:0;padding:0;color:silver}.qz-modal-body{padding:10px}.qz-modal-footer{padding:10px;border-top:1px solid #d3d3d3;text-align:center}'
        };
    }();

    /* Module Definition */

    Queiroz.module.style = Style;

})(Queiroz);


/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
      Strings = Queiroz.module.strings,
      Style = Queiroz.module.style;

    /* Constants */

    var
        TagName = {
            DIV: 'div',
            P: 'p',
            SPAN: 'span',
            STYLE: 'style',
            STRONG: 'strong',
            BUTTON: 'button',
            SMALL: 'small',
            TABLE: 'table',
            THEAD: 'thead',
            TBODY: 'tbody',
            TH: 'th',
            TR: 'tr',
            TD: 'td'
        };


    /* Class Definition */

    var Snippet = function() {

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

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, '', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLastWeekModeOn: function() {
                return _buildBoxHeader('', Strings('hLastWeek'), 'qz-text-primary');
            },
            headerLaborTime: function(laborTime) {
                return _buildBoxHeader(Strings('hLabor'), laborTime, 'qz-text-green');
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBoxHeader(Strings('hBalance'), balanceTime, 'qz-text-teal');
            },
            headerWeekPendingTime: function(pendingTime) {
                return _buildBoxHeader(Strings('hPending'), pendingTime, 'qz-text-primary');
            },
            headerExtraTime: function(extraTime) {
                return _buildBoxHeader(Strings('hExtra'), extraTime, 'qz-text-green');
            },
            headerBeta: function() {
                var box = _buildBoxHeader('', '', 'fa fa-flask');
                box.onclick = function() {
                    Queiroz.beta();
                }
                return box;
            },
            balanceTimePerDay: function(balanceTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('balance'));
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-teal', balanceTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerDay: function(laborTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('labor'));
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
                    var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('working'));
                    div.appendChild(helpText);
                    time.classList.add('qz-text-golden');
                }
                div.appendChild(time);
                return div;
            },
            todayTimeToLeave: function(timeToLeave, balanced) {
                var helpText = balanced ? Strings('balancedExit') : Strings('exit');
                var content = _buildTag(TagName.DIV, 'qz-help-text', helpText);
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-primary', timeToLeave);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(content);
                div.appendChild(time);
                return div;
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, Queiroz);


/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var Snippet = Queiroz.snippet;

    /* Class Definition */

    var View = function() {

        /* Constants */

        var
            Selector = {
                HEAD: 'head',
                BODY: 'body',
                COLUMN_DAY: '.DiaApontamento',
                CHECKPOINT: '.FilledSlot span',
                DATE: '[id^=hiddenDiaApont]',
                HEADER: '#SemanaApontamentos div',
                TIME_IN: '.TimeIN,.TimeINVisualizacao',
                FOOTER: 'footer .LabelEmpresa'
            };

        /* Private Functions */

        var
            _asyncReflow = function(task) {
                setTimeout(task, 25);
            },
            _get = function(selector, target) {
                return (target || document).querySelector(selector);
            },
            _getAll = function(selector, target) {
                return (target || document).querySelectorAll(selector);
            },
            _append = function(selector, html, callback) {
              _asyncReflow(function() {
                  var
                      element = _get(selector),
                      container = document.createElement('div');

                  if (typeof html === 'string') {
                      container.innerHTML = html;
                  } else {
                      container.appendChild(html);
                  }

                  element.appendChild(container);

                  if (callback)
                    callback();
              });
            };

        /* Public Functions */

        return {
            collectData: function() {
                var
                    data = {},
                    days = [],
                    eColumns = _getAll(Selector.COLUMN_DAY);

                eColumns.forEach(function(eDay) {
                    var
                        day = {
                            date: _get(Selector.DATE, eDay).value,
                            periods: []
                        },
                        eCheckpoints = _getAll(Selector.CHECKPOINT, eDay);

                    eCheckpoints.forEach(function(eTime) {
                        var
                            _classes = eTime.classList.value,
                            _time = eTime.textContent,
                            _periods = day.periods;

                        if (/TimeIN/.test(_classes)) {
                            _periods.push({in:_time, out:false});
                        } else
                            if (/TimeOUT/.test(_classes)) {
                                var _last = _periods.last();
                                if (_last && _last.out == false) {
                                    _last.out = _time;
                                } else {
                                    _periods.push({in:false, out:_time});
                                }
                            }
                    });
                    days.push(day);
                });
                data.days = days;
                return data;
            },
            isLoaded: function() {
                return _get(Selector.CHECKPOINT);
            },
            getAllColumnDay: function() {
                return _getAll(Selector.COLUMN_DAY);
            },
            getAllCheckpoint: function(target) {
                return _getAll(Selector.CHECKPOINT, target);
            },
            getDateFromTargetAsString: function(target) {
                return _get(Selector.DATE, target).value;
            },
            getAllTimeIn: function(target) {
                return _getAll(Selector.TIME_IN, target);
            },
            appendToHead: function(html) {
                _append(Selector.HEAD, html);
            },
            appendToBody: function(html, callback) {
                _append(Selector.BODY, html, callback);
            },
            appendToHeader: function(html) {
                _append(Selector.HEADER, html);
            },
            appendToFooter: function(text) {
                _get(Selector.FOOTER).textContent += " | " + text;
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.view = View;

})(document, Queiroz);

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


/*!
 * Queiroz.js: util.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Polyfill */

    Array.prototype.last = function() {
        return this[this.length-1];
    };
    Number.prototype.format = function(length) {
        var _number = ''+this;
        while(_number.length < length)
            _number = '0'+_number;
        return _number;
    };
    Date.prototype.getTimeAsString = function() {
        return this.getHours().format(2) + ':' + this.getMinutes().format(2);
    };
    Date.prototype.getDayOfMonth = function() {
        return this.getDate();
    };
    Date.prototype.getMillis = function() {
        return this.getTime();
    };
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }

    /* Class Definition */

    var Util = function() {
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

    /* Module Definition */

    Queiroz.module.util = Util;

})(Queiroz);


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
        _getCheckpoints = function(eDay) {
            return View.getAllCheckpoint(eDay);
        },
        _getDate = function(eDay) {
            return View.getDateFromTargetAsString(eDay);
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
                htmlLastWeekModeOn = Snippet.headerLastWeekModeOn(),
                htmlBalanceTime = data.week.balanceTime.html,
                htmlPendingOrExtraTime = _getPendingOrExtraTime();

            if (Settings.LAST_WEEK_MODE == false)
                htmlLastWeekModeOn = '';

            // prevents confusion on exit x balance time
            if ((_getMaxHoursPerWeekInMillis() - data.week.laborTime.millis) < _getMaxConsecutiveHoursPerDayInMillis())
                htmlBalanceTime = '';

            var
                args = [
                    htmlLastWeekModeOn,
                    data.week.laborTime.html,
                    htmlBalanceTime,
                    htmlPendingOrExtraTime,
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
            if (data.week.balanceTime.millis) {
                var pendingTime = (_getMaxMinutesPerDayInMillis() - data.today.laborTime.millis) - data.week.balanceTime.millis;
                var timeToLeaveInMillis = inputMillis + (pendingTime < 0 ? 0 : pendingTime);
                var humanTimeToLeave = new Date(timeToLeaveInMillis).getTimeAsString();
                var html = Snippet.todayTimeToLeave(humanTimeToLeave, true);
                var filledSlotOut = context.parentNode;
                filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
            }
        },
        _renderTodayTimeToLeave = function(context, inputMillis) {
            if (data.today.laborTime.millis < _getMaxMinutesPerDayInMillis()) {
                _renderTodayBalancedTimeToLeave(context, inputMillis);
                var pendingTime = _getMaxMinutesPerDayInMillis() - data.today.laborTime.millis;
                var timeToLeaveInMillis = inputMillis + pendingTime;
                var humanTimeToLeave = new Date(timeToLeaveInMillis).getTimeAsString();
                var html = Snippet.todayTimeToLeave(humanTimeToLeave, false);
                var filledSlotOut = context.parentNode;
                filledSlotOut.parentNode.insertBefore(html, filledSlotOut.nextSibling);
            }
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
                    } else {
                        eDay.remove();
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
        View.appendToBody('<div class="qz-modal"><div class="qz-modal-dialog"><div class="qz-modal-content"><div class="qz-modal-header">Queiroz.js 3.0 is coming <button class="qz-modal-close"><span class="fa fa-times"></span></button></div><div class="qz-modal-body qz-text-center"><h1>Coming soon!</h1></div><div class="qz-modal-footer"><small>Queiroz.js 2.9.5</small></div></div></div></div>', function() {
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


/*!
 * Queiroz.js: autoexec.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

Queiroz.bless();
