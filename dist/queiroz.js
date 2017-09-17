
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
            VERSION = '3.1.22',
            SETTINGS = {"USERSCRIPT_DELAY":1000,"MAX_CONSECUTIVE_MINUTES":360,"WEEKLY_GOAL_MINUTES":2640,"DAILY_GOAL_MINUTES":528,"WORK_DAYS":[1,2,3,4,5],"INITIAL_WEEKDAY":1,"GA_TRACKING_ID":"UA-105390656-1","KEEP_ALIVE":60000};

        /* Public API */

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
 * Queiroz.js: polyfill.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function() {

    /* Array API */

    Array.prototype.last = function() {
        return this[this.length-1];
    };
    Array.prototype.contains = function(value) {
        return this.indexOf(value) > -1;
    };

    /* Date API */

    Date.now = function() {
        return new Date();
        //return new Date(2017,8,4,9,34); // => for TEST
    };
    Date.parseKairos = function(string) {
        var
            dateTime = string.split(' '),
            date = dateTime[0].split('_'),
            time = dateTime[1].split(':');
        return new Date(date[2], (date[1] - 1), date[0], time[0], time[1]);
    };
    Date.prototype.isToday = function() {
        var _now = Date.now();
        return this.getDayOfMonth() === _now.getDayOfMonth() &&
               this.getMonth() === _now.getMonth() &&
               this.getFullYear() === _now.getFullYear();
    };
    Date.prototype.getFixedMonth = function() {
        return this.getMonth() + 1;
    };
    Date.prototype.getDateAsKairos = function() {
        return this.getDate().padStart(2) + "_" + this.getFixedMonth().padStart(2) + "_" + this.getFullYear();
    };
    Date.prototype.getTimeAsString = function() {
        return this.getHours().padStart(2) + ':' + this.getMinutes().padStart(2);
    };
    Date.prototype.getDayOfMonth = function() {
        return this.getDate();
    };
    Date.prototype.getMillis = function() {
        return this.getTime();
    };

    /* Others */

    Storage.prototype.hasItem = function(name) {
        return !!this.getItem(name);
    };
    Number.prototype.padStart = function(length) {
        var _number = ''+this;
        while(_number.length < length)
            _number = '0'+_number;
        return _number;
    };
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
    String.prototype.contains = function(str) {
        return this.indexOf(str) > -1;
    };

})();

/*!
 * Queiroz.js: keepalive.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(setTimeout, clearTimeout, Queiroz) {

    /* Modules */

    var Settings = Queiroz.settings;

    /* Class Definition */

    var KeepAlive = function() {

        var _timeOut;

        /* Public Functions */

        return {
            init: function() {
                if (_timeOut)
                    clearTimeout(_timeOut);

                _timeOut = setTimeout(Queiroz.reload, Settings.KEEP_ALIVE);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.keepalive = KeepAlive;

})(setTimeout, clearTimeout, Queiroz);


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

    Strings._ = {"pending":"Pendente","extra":"Extra","balance":"Saldo do dia","totalBalance":"Saldo Total","labor":"Efetuado","shift":"_n_º Turno","working":"Trabalhando...","exit":"Saída (Meta)","exit+":"Saída + Saldo","config":"Config","weeklyGoal":"Meta Semanal","dailyGoal":"Meta do dia","timeOn":"Falta Abonada"};

    /* Module Definition */

    Queiroz.module.strings = Strings;

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
            CSS: 'html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}#SemanaApontamentos{cursor:default!important}.ContentTable{margin-top:inherit}.FilledSlot,.LastSlot,.emptySlot{height:inherit;padding:5px}.FilledSlot span{margin:inherit!important}.qz-text-center{text-align:center}.qz-text-primary{color:brown}.qz-text-golden{color:#b8860b}.qz-text-green{color:green}.qz-text-teal{color:teal}.qz-text-black{color:#000}.qz-text-purple{color:#639}.qz-text-orange{color:#e27300}.qz-box{padding:5px 10px;margin:5px 1px;border:#a9a9a9 1px solid;min-width:60px}.qz-box-compact{min-width:auto}.qz-box-inline{display:inline-block}.qz-box-head{float:right}.qz-box-muted{background-color:#d3d3d3}.qz-box .qz-box-content{vertical-align:middle}.qz-help-text{font-size:10px}.qz-fa{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;user-select:none}.qz-fa-se{float:right;margin:4px -8px 0 -8px}.qz-fa-sw{float:left;margin:4px -10px 0 -8px}.qz-toggle{margin-top:10px}.fa-toggle-on{color:green}.fa-toggle-off{color:grey}.js-show{display:block}.js-hide{display:none}.fa-chevron-down,.fa-chevron-up{margin:0 2.5px}.qz-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1024;background-color:rgba(0,0,0,.5)}.qz-modal-dialog{position:relative;width:900px;margin:30px auto}.qz-modal-content{position:relative;background-color:#fff;background-clip:padding-box;border-radius:5px}.qz-modal-header{padding:10px;border-bottom:1px solid #d3d3d3;font-weight:700;font-size:16px}.qz-modal-close{float:right;cursor:pointer;background:0 0;border:0;padding:0;color:silver}.qz-modal-body{padding:10px}.qz-modal-footer{padding:10px;border-top:1px solid #d3d3d3;text-align:center}'
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

    /* Class Definition */

    var Snippet = function() {

        /* Constants */

        var
            TagName = {
                BR: 'br',
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
            },
            _buildEditableTimeOnBox = function(TimeOn) {
                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center js-has-timeon');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('timeOn'));
                var upHour = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-up');
                var upMin = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-up');
                var eTime = _buildTag(TagName.STRONG, 'qz-box-content js-self-timeon', '00:00');
                var downHour = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-down');
                var downMin = _buildTag(TagName.SPAN,'qz-fa fa fa-chevron-down');
                var cancel = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-times');
                var save = _buildTag(TagName.SPAN,'qz-fa qz-fa-se qz-text-green fa fa-floppy-o');

                upHour.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-self-timeon');
                    var time = eTime.textContent.split(':');
                    var hour = parseInt(time[0]);
                    if (hour == 23) hour = 0;
                    else hour+=1;
                    eTime.textContent = hour.padStart(2) + ':' + time[1];
                };
                downHour.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-self-timeon');
                    var time = eTime.textContent.split(':');
                    var hour = parseInt(time[0]);
                    if (hour == 0) hour = 23;
                    else hour-=1;
                    eTime.textContent = hour.padStart(2) + ':' + time[1];
                };
                upMin.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-self-timeon');
                    var time = eTime.textContent.split(':');
                    var min = parseInt(time[1]);
                    if (min == 59) min = 0;
                    else min+=1;
                    eTime.textContent = time[0] + ':' + min.padStart(2);
                };
                downMin.onclick = function() {
                    var eTime = this.parentElement.querySelector('.js-self-timeon');
                    var time = eTime.textContent.split(':');
                    var min = parseInt(time[1]);
                    if (min == 0) min = 59;
                    else min-=1;
                    eTime.textContent = time[0] + ':' + min.padStart(2);
                };
                cancel.onclick = function() {
                    this.parentElement.remove();
                };
                save.onclick = function() {
                    var eDay = this.parentElement.parentElement;
                    var eDate = eDay.querySelector('[id^=hiddenDiaApont]').value;
                    var eTime = eDay.querySelector('.js-self-timeon').textContent;
                    if (TimeOn.add(eDate, eTime))
                        Queiroz.reload();
                };

                box.appendChild(helpText);
                box.appendChild(upHour);
                box.appendChild(upMin);
                box.appendChild(_buildTag(TagName.BR));
                box.appendChild(eTime);
                box.appendChild(_buildTag(TagName.BR));
                box.appendChild(downHour);
                box.appendChild(downMin);
                box.appendChild(cancel);
                box.appendChild(save);
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
            headerWeeklyGoal: function(weeklyGoal) {
                return _buildBox({
                    helpText: 'weeklyGoal',
                    humanTime: weeklyGoal,
                    contentClass: 'qz-text-black',
                    inlineText: true
                });
            },
            headerLaborTime: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green',
                    inlineText: true
                });
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBox({
                    helpText: (balanceTime.contains('+') ? 'extra' : 'pending'),
                    humanTime: balanceTime,
                    contentClass: 'qz-text-' + (balanceTime.contains('+') ? 'green' : 'primary'),
                    inlineText: true
                });
            },
            balanceTimePerDay: function(balanceTime, total) {
                return _buildBox({
                    helpText: (total ? 'totalB' : 'b') + 'alance',
                    humanTime: balanceTime,
                    contentClass: 'qz-text-'+ (total ? 'purple' : 'teal')
                });
            },
            dailyGoal: function(dailyGoal) {
                return _buildBox({
                    helpText: 'dailyGoal',
                    humanTime: dailyGoal,
                    contentClass: 'qz-text-black'
                });
            },
            laborTimePerDay: function(laborTime, TimeOn) {
                var box = _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green'
                });
                var addTimeOn = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-puzzle-piece');
                addTimeOn.onclick = function() {
                    var eDay = this.parentElement.parentElement;
                    if (eDay.querySelector('.js-has-timeon'))
                        return;

                    eDay.appendChild(_buildEditableTimeOnBox(TimeOn));
                };
                box.appendChild(addTimeOn);
                return box;
            },
            laborTimePerShift: function(laborTime, finished, number) {
                var box = _buildBox({
                    helpText: (finished ? 'shift' : 'working'),
                    humanTime: laborTime,
                    contentClass: (finished ? '' : 'qz-text-golden')
                });
                if (finished) {
                    var help = box.querySelector('.qz-help-text');
                    var text = help.textContent.replace('_n_', number);
                    help.textContent = text;
                }
                return box;
            },
            todayTimeToLeave: function(timeToLeave, balanced) {
                return _buildBox({
                    helpText: 'exit' + (balanced ? '+' : ''),
                    humanTime: timeToLeave,
                    contentClass: 'qz-text-primary'
                });
            },
            buildTimeOnBox: function(TimeOn, humanTime) {
                var box = _buildBox({
                    helpText: 'timeOn',
                    humanTime: humanTime,
                    contentClass: 'qz-text-orange'
                });
                var remove = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-times');
                remove.onclick = function() {
                    var eDay = this.parentElement.parentElement;
                    var eDate = eDay.querySelector('[id^=hiddenDiaApont]').value;
                    TimeOn.remove(eDate);
                    Queiroz.reload();
                };
                box.appendChild(remove);
                return box;
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, Queiroz);


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
                return date.getDate().padStart(2) + "/" + date.getFixedMonth().padStart(2);
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


/*!
 * Queiroz.js: timeon.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(localStorage, Queiroz) {

    /* Modules */

    var
        mod     = Queiroz.module,
        Snippet = mod.snippet,
        Time    = mod.time;

    /* Class Definition */

    var TimeOn = function() {

        var
            NAME = "timeOn",
            cache = {};

        /* Private Functions */

        var
            _buildKey = function(date) {
                return date.getDate().padStart(2) + "/" + date.getFixedMonth().padStart(2);
            },
            _has = function(date) {
                return !!cache[_buildKey(date)];
            },
            _get = function(date) {
                return cache[_buildKey(date)];
            },
            _add = function(date, time) {
                var key = _buildKey(date);
                if (_has(date) == false)
                    cache[key] = 0;

                cache[key] += time;
                localStorage.setItem(NAME, JSON.stringify(cache));
            },
            _remove = function(date) {
                if (_has(date) == false)
                    return;

                delete cache[_buildKey(date)];
                localStorage.setItem(NAME, JSON.stringify(cache));
            };

        // Initialize cache
        if (localStorage.hasItem(NAME)) {
            cache = JSON.parse(localStorage.getItem(NAME));
        }

        /* Public Functions */

        return {
            buildBox: function(humanTime) {
                return Snippet.buildTimeOnBox(this, humanTime);
            },
            check: function(data) {
                data.days.forEach(function(day) {
                    day.timeOn = false;
                    if (_has(day.date))
                        day.timeOn = _get(day.date);
                });
            },
            add: function(eDate, eTime) {
                var time = Time.humanToMillis(eTime);
                if (!!time == false)
                    return false;

                var date = Date.parseKairos(eDate + " " + Time.zero);
                _add(date, time);
                return true;
            },
            remove: function(eDate) {
                var date = Date.parseKairos(eDate + " " + Time.zero);
                _remove(date);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.timeon = TimeOn;

})(localStorage, Queiroz);


/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
        Settings = Queiroz.settings,
        mod      = Queiroz.module,
        Snippet  = mod.snippet,
        TimeOn   = mod.timeon;

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
            render: function(data) {
                var eColumns = _getAll(Selector.COLUMN_DAY);
                data.days.forEach(function(day) {
                    eColumns.forEach(function(eDay) {
                        var eDate = _get(Selector.DATE, eDay).value;
                        if (day.date.getDateAsKairos() == eDate) {
                            if (day.periods.length) {
                                day.periods.forEach(function(time, index) {
                                    if (!!time.out || (time.out == false && day.date.isToday()))
                                        eDay.appendChild(Snippet.laborTimePerShift(time.shift, (!!time.out), (index+1)));
                                });
                                if (day.timeOn) {
                                    eDay.appendChild(TimeOn.buildBox(day.timeOn));
                                }
                                eDay.appendChild(Snippet.dailyGoal(day.goal));
                                eDay.appendChild(Snippet.laborTimePerDay(day.worked, TimeOn));
                                eDay.appendChild(Snippet.balanceTimePerDay(day.balance, false));
                                if (day.date.isToday() == false) {
                                    eDay.appendChild(Snippet.balanceTimePerDay(day.totalBalance, true));
                                }
                                day.periods.forEach(function(time, index) {
                                    if (time.out == false && day.date.isToday()) {
                                        eDay.appendChild(Snippet.todayTimeToLeave(time.leave, false));
                                        eDay.appendChild(Snippet.todayTimeToLeave(time.balancedLeave, true));
                                    }
                                });
                            }
                        }
                    });
                });

                var header = Snippet.header();
                header.appendChild(Snippet.headerWeeklyGoal(data.weeklyGoal));
                header.appendChild(Snippet.headerLaborTime(data.worked));
                header.appendChild(Snippet.headerBalanceTime(data.weeklyBalance));
                View.appendToHeader(header);
            },
            isLoaded: function() {
                return _get(Selector.COLUMN_DAY);
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
 * Queiroz.js: core.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Modules */

    var
        Settings  = Queiroz.settings,
        mod       = Queiroz.module,
        KeepAlive = mod.keepalive,
        Snippet   = mod.snippet,
        View      = mod.view,
        DayOff    = mod.dayoff,
        Time      = mod.time,
        TimeOn    = mod.timeon;

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
                var day = Date.parseKairos(View.getDateFromTargetAsString(eDay) + " " + Time.zero);
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
            var data = View.read();
            Time.parse(data);
            View.removeUnusedDays(data);
            _buildDayOffOption();
            DayOff.check(data);
            TimeOn.check(data);
            Time.compute(data);
            Time.toHuman(data);
            View.render(data);
            KeepAlive.init();
        },
        _initWithDelay = function() {
            var interval = setInterval(function() {
                if (View.isLoaded()) {
                    clearInterval(interval);
                    _init();
                }
            }, Settings.USERSCRIPT_DELAY);
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

        View.appendToBody('<div class="qz-modal"><div class="qz-modal-dialog"><div class="qz-modal-content"><div class="qz-modal-header">Queiroz.js 3.0 is coming <button class="qz-modal-close"><span class="fa fa-times"></span></button></div><div class="qz-modal-body qz-text-center"><h1>Coming soon!</h1></div><div class="qz-modal-footer"><small>Queiroz.js 3.1.22</small></div></div></div></div>', function() {
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
