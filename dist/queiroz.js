
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
            VERSION = '3.0.8',
            SETTINGS = {"USERSCRIPT_DELAY_MILLIS":1000,"MAX_CONSECUTIVE_MINUTES":360,"WEEKLY_GOAL_MINUTES":2640,"DAILY_GOAL_MINUTES":528,"WORK_DAYS":[1,2,3,4,5],"INITIAL_WEEKDAY":1,"GA_TRACKING_ID":"UA-105390656-1"};

        /* Public Functions */

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          module: {},
          settings: SETTINGS
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);

/*!
 * Queiroz.js: analytics.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 *
 * Analytics DevGuide:
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/
 */

(function(Queiroz, ga) {

    var
        Settings = Queiroz.settings,
        trackerName = 'qzTkr';

    ga('create', Settings.GA_TRACKING_ID, 'auto', trackerName);

    ga(trackerName+'.set', {
        appName: Queiroz.name,
        appVersion: Queiroz.version
    });

    ga(trackerName+'.send', 'screenview', {
        screenName: document.querySelector('.PageTitle').textContent
    });

})(Queiroz, ga);


/*!
 * Queiroz.js: strings.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Strings = function(key) {
        return Strings._[key];
    };

    Strings._ = {"pending":"Pendente","extra":"Extra","balance":"Saldo","labor":"Efetuado","shift":"Turno","working":"Trabalhando...","exit":"Saída (08:48)","exit+":"Saída + Saldo","config":"Config"};

    /* Module Definition */

    Queiroz.module.strings = Strings;

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
    Array.prototype.contains = function(value) {
        return this.indexOf(value) > -1;
    };
    Storage.prototype.hasItem = function(name) {
        return (this.getItem(name) || false);
    };
    Number.prototype.format = function(length) {
        var _number = ''+this;
        while(_number.length < length)
            _number = '0'+_number;
        return _number;
    };
    Date.prototype.getDateAsKairos = function() {
        return this.getDate().format(2) + "_" + (this.getMonth()+1).format(2) + "_" + this.getFullYear();
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
    };
    String.prototype.contains = function(str) {
        return this.indexOf(str) > -1;
    };

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
 * Queiroz.js: style.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Style = function() {
        return {
            CSS: 'html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}#SemanaApontamentos{cursor:default!important}.ContentTable{margin-top:inherit}.FilledSlot,.LastSlot,.emptySlot{height:inherit;padding:5px}.FilledSlot span{margin:inherit!important}.qz-text-center{text-align:center}.qz-text-primary{color:brown}.qz-text-golden{color:#b8860b}.qz-text-green{color:green}.qz-text-teal{color:teal}.qz-box{padding:5px 10px;margin:5px 1px;border:#a9a9a9 1px solid;min-width:60px}.qz-box-compact{min-width:auto}.qz-box-inline{display:inline-block}.qz-box-head{float:right}.qz-box-muted{background-color:#d3d3d3}.qz-box .qz-box-content{vertical-align:middle}.qz-help-text{font-size:10px}.qz-toggle{margin-top:10px}.fa-toggle-on{color:green}.fa-toggle-off{color:grey}.js-show{display:block}.js-hide{display:none}.qz-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1024;background-color:rgba(0,0,0,.5)}.qz-modal-dialog{position:relative;width:900px;margin:30px auto}.qz-modal-content{position:relative;background-color:#fff;background-clip:padding-box;border-radius:5px}.qz-modal-header{padding:10px;border-bottom:1px solid #d3d3d3;font-weight:700;font-size:16px}.qz-modal-close{float:right;cursor:pointer;background:0 0;border:0;padding:0;color:silver}.qz-modal-body{padding:10px}.qz-modal-footer{padding:10px;border-top:1px solid #d3d3d3;text-align:center}'
        };
    }();

    /* Module Definition */

    Queiroz.module.style = Style;

})(Queiroz);


/*!
 * Queiroz.js: dayoff.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(localStorage, Queiroz) {

    /* Class Definition */

    var DayOff = function() {

        var
            NAME = "dayoff",
            cache = [];

        /* Private Functions */

        var
            _buildValue = function(date) {
                return date.getDate().format(2) + "/" + (date.getMonth()+1).format(2);
            },
            _is = function(date) {
                return cache.contains(_buildValue(date));
            },
            _add = function(date) {
                if (_is(date))
                    return;

                cache.push(_buildValue(date));
                localStorage.setItem(NAME, JSON.stringify(cache));
            },
            _remove = function(date) {
                if (_is(date) == false)
                    return;

                var index = cache.indexOf(_buildValue(date));
                cache.splice(index, 1);
                localStorage.setItem(NAME, JSON.stringify(cache));
            };

        // Initialize cache
        if (localStorage.hasItem(NAME)) {
            cache = JSON.parse(localStorage.getItem(NAME));
        }

        /* Public Functions */

        return {
            check: function(data) {
                var _days = [];
                data.days.forEach(function(day) {
                    if (_is(day.date) == false)
                        _days.push(day);
                });
                data.days = _days;
            },
            is: _is,
            add: _add,
            remove: _remove
        };
    }();

    DayOff.count = 0;

    /* Module Definition */

    Queiroz.module.dayoff = DayOff;

})(localStorage, Queiroz);


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

    /* Class Definition */

    var Snippet = function() {

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
            _buildBox = function(opt) {
                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings(opt.helpText));
                var humanTime = _buildTag(TagName.STRONG, 'qz-box-content '+opt.contentClass, opt.humanTime);
                box.appendChild(helpText);
                box.appendChild(humanTime);
                if (opt.inlineText) box.className += ' qz-box-inline';
                return box;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            buildToggleForDayOff: function(key) {
                return _buildTag(TagName.SPAN,'fa fa-toggle-'+key+' qz-toggle');
            },
            headerBeta: function() {
                var box = _buildBox({
                    helpText: 'config',
                    humanTime: '',
                    contentClass: 'fa fa-flask qz-text-golden',
                    inlineText: true
                });
                box.className += ' qz-box-compact';
                box.onclick = function() {
                    Queiroz.beta();
                }
                return box;
            },
            headerLaborTime: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green',
                    inlineText: true
                });
            },
            headerBalanceTime: function(balanceTime, weekly) {
                return _buildBox({
                    helpText: (weekly ? (balanceTime.contains('+') ? 'extra' : 'pending') : 'balance'),
                    humanTime: balanceTime,
                    contentClass: 'qz-text-' + (weekly ? (balanceTime.contains('+') ? 'green' : 'primary') : 'teal'),
                    inlineText: true
                });
            },
            balanceTimePerDay: function(balanceTime) {
                return _buildBox({
                    helpText: 'balance',
                    humanTime: balanceTime,
                    contentClass: 'qz-text-teal'
                });
            },
            laborTimePerDay: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green'
                });
            },
            laborTimePerShift: function(laborTime, finished) {
                return _buildBox({
                    helpText: (finished ? 'shift' : 'working'),
                    humanTime: laborTime,
                    contentClass: (finished ? '' : 'qz-text-golden')
                });
            },
            todayTimeToLeave: function(timeToLeave, balanced) {
                return _buildBox({
                    helpText: 'exit' + (balanced ? '+' : ''),
                    humanTime: timeToLeave,
                    contentClass: 'qz-text-primary'
                });
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

    var Settings = Queiroz.settings,
        Snippet  = Queiroz.module.snippet;

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
                FOOTER: 'footer .LabelEmpresa',
                TOOGLE: '.HfIsFolga',
                QUEIROZ: '*[class*=qz-]'
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
                  var element = _get(selector);

                  if (typeof html === 'string') {
                      var container = document.createElement('DIV');
                      container.innerHTML = html;
                      html = container.firstChild;
                  }

                  element.appendChild(html);

                  if (callback)
                    callback();
              });
          },
          _appendTo = function(target, element) {
              var filledSlotOut = target.parentNode;
              filledSlotOut.parentNode.insertBefore(element, filledSlotOut.nextSibling);
          };

        /* Public Functions */

        return {
            read: function() {
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
            removeUnusedDays: function(data) {
                var
                    targetIndex = 0,
                    days = data.days;
                days.forEach(function(day, index) {
                    if (day.date.getDay() === Settings.INITIAL_WEEKDAY)
                        targetIndex = index;
                });
                data.days = days.slice(targetIndex);

                var eColumns = _getAll(Selector.COLUMN_DAY);
                eColumns.forEach(function(eDay) {
                    var remove = true;
                    data.days.forEach(function(day) {
                        var eDate = _get(Selector.DATE, eDay).value;
                        if (day.date.getDateAsKairos() == eDate)
                            remove = false;
                    });
                    if (remove)
                        eDay.remove();
                });
            },
            showResult: function(data) {
                var eColumns = _getAll(Selector.COLUMN_DAY);
                data.days.forEach(function(day) {
                    eColumns.forEach(function(eDay) {
                        var eDate = _get(Selector.DATE, eDay).value;
                        if (day.date.getDateAsKairos() == eDate) {
                            day.periods.forEach(function(time) {
                                if (time.out == false) {
                                    eDay.appendChild(Snippet.laborTimePerShift(time.shift, false));
                                    eDay.appendChild(Snippet.todayTimeToLeave(time.leave, false));
                                    eDay.appendChild(Snippet.todayTimeToLeave(time.balancedLeave, true));
                                } else {
                                    eDay.appendChild(Snippet.laborTimePerShift(time.shift, true));
                                }
                            });
                            if (day.periods.length) {
                                eDay.appendChild(Snippet.laborTimePerDay(day.worked));
                                eDay.appendChild(Snippet.balanceTimePerDay(day.balance));
                            }
                        }
                    });
                });

                var header = Snippet.header();
                header.appendChild(Snippet.headerLaborTime(data.worked));
                header.appendChild(Snippet.headerBalanceTime(data.dailyBalance, false));
                header.appendChild(Snippet.headerBalanceTime(data.weeklyBalance, true));
                header.appendChild(Snippet.headerBeta());
                View.appendToHeader(header);
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
            getAllQueirozElements: function() {
                return _getAll(Selector.QUEIROZ);
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
                var footerContent = _get(Selector.FOOTER).textContent;
                if (footerContent && footerContent.contains(text) == false)
                    _get(Selector.FOOTER).textContent += " | " + text;
            },
            appendToggle: function(target, eToggle) {
                _get(Selector.TOOGLE, target).parentElement.appendChild(eToggle);
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

    var
        Settings = Queiroz.settings,
        DayOff   = Queiroz.module.dayoff;

    /* Class Definition */

    var Time = function() {

        /* Constants */

        var
            FAKE_TIME = '12:34',
            ZERO_TIME = '00:00',
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60,
            DAILY_GOAL_MINUTES_IN_MILLIS = Settings.DAILY_GOAL_MINUTES * MINUTE_IN_MILLIS,
            MAX_CONSECUTIVE_MINUTES_IN_MILLIS = Settings.MAX_CONSECUTIVE_MINUTES * MINUTE_IN_MILLIS;

        var computeWeeklyGoalMillis = function() {
            return (Settings.WEEKLY_GOAL_MINUTES * MINUTE_IN_MILLIS) - (DayOff.count * DAILY_GOAL_MINUTES_IN_MILLIS);
        };

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
                        else if (time.in)
                            time.shift = _diff(time.in, new Date());
                    });
                });
            },
            _computeLaborTime = function(data) {
                data.worked = 0;
                data.days.forEach(function(day) {
                    day.worked = 0;
                    day.periods.forEach(function(time) {
                        if (time.in && time.out)
                            day.worked += time.shift
                    });
                    data.worked += day.worked;
                });
            },
            _computeBalanceTime = function(data) {
                var _now = new Date();
                data.dailyBalance = 0;
                data.days.forEach(function(day) {
                    day.balance = 0;
                    if (day.periods.length) {
                        day.balance = (0 - DAILY_GOAL_MINUTES_IN_MILLIS) + day.worked;
                        if (day.date.getDayOfMonth() < _now.getDayOfMonth()) {
                            data.dailyBalance += day.balance;
                        }
                    }
                });
                data.weeklyBalance = (0 - computeWeeklyGoalMillis()) + data.worked;
            },
            _computeTimeToLeave = function(data) {
                data.days.forEach(function(day) {
                    var _periods = day.periods;
                    if (_isToday(day.date) && _periods.length) {
                        var _time = _periods.last();
                        if (_time.out == false) {
                            if (day.worked < DAILY_GOAL_MINUTES_IN_MILLIS) {
                                var pending = _diff(day.worked, DAILY_GOAL_MINUTES_IN_MILLIS);
                                _time.leave = new Date(_time.in.getMillis() + pending);
                                _time.balancedLeave = new Date(_time.leave.getMillis() - data.dailyBalance);
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
                            time.in = _toDate(day.date + " " + time.in);

                        if (time.out)
                            time.out = _toDate(day.date + " " + time.out);
                    });
                    day.date = _toDate(day.date + " " + FAKE_TIME);
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
                    day.worked = _millisToHuman(day.worked);
                    day.balance = _millisToHumanWithSign(day.balance);
                });
                data.worked = _millisToHuman(data.worked);
                data.dailyBalance = _millisToHumanWithSign(data.dailyBalance);
                data.weeklyBalance = _millisToHumanWithSign(data.weeklyBalance);
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
 * Queiroz.js: core.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        Settings = Queiroz.settings,
        mod      = Queiroz.module,
        View     = mod.view,
        Time     = mod.time,
        Util     = mod.util,
        Snippet  = mod.snippet,
        DayOff   = mod.dayoff;

    /* Private Functions */

    var
        _buildToggleForDayOff = function(day) {
            var eToggle = Snippet.buildToggleForDayOff(DayOff.is(day) ? 'off' : 'on');
            eToggle.onclick = function() {
                var _day = day;
                if (DayOff.is(_day)) {
                    DayOff.remove(_day);
                    DayOff.count--;
                } else {
                    DayOff.add(_day);
                    DayOff.count++;
                }
                Queiroz.reload();
            };
            return eToggle;
        },
        _buildDayOffOption = function() {
            View.getAllColumnDay().forEach(function(eDay) {
                var day = Time.toDate(View.getDateFromTargetAsString(eDay) + " " + Time.fake);
                if (Settings.WORK_DAYS.contains(day.getDay())) {
                    var eToggle = _buildToggleForDayOff(day);
                    View.appendToggle(eDay, eToggle);

                    // ignores stored days
                    if (DayOff.is(day)) {
                        DayOff.count++;
                        return;
                    }
                }
            });
        },
        _init = function() {
            View.appendToHead(Snippet.style());
            _buildDayOffOption();
            var data = View.read();
            Time.parse(data);
            View.removeUnusedDays(data);
            DayOff.check(data);
            Time.compute(data);
            Time.toHuman(data);
            View.showResult(data);
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
        if (View.isLoaded()) {
            _init();
        } else {
            _initWithDelay();
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

        View.appendToBody('<div class="qz-modal"><div class="qz-modal-dialog"><div class="qz-modal-content"><div class="qz-modal-header">Queiroz.js 3.0 is coming <button class="qz-modal-close"><span class="fa fa-times"></span></button></div><div class="qz-modal-body qz-text-center"><h1>Coming soon!</h1></div><div class="qz-modal-footer"><small>Queiroz.js 3.0.8</small></div></div></div></div>', function() {
            document.querySelector(".qz-modal-close").onclick = function() {
                if (!modal) {
                    modal = document.querySelector('.qz-modal');
                }
                modal.classList.remove('js-show');
                modal.classList.add('js-hide');
            };
        });
    };

    Queiroz.reload = function() {
        View.getAllQueirozElements().forEach(function(element) {
            element.remove();
        });

        // reset
        DayOff.count = 0;

        Queiroz.bless();
    };

})(Queiroz);


/*!
 * Queiroz.js: autoexec.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

Queiroz.bless();
