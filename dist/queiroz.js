
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
            VERSION = '3.7.52';

        /* Public API */

        return {
          name: NAME,
          version: VERSION,
          description: NAME + ' ' + VERSION,
          module: {}
        };
    }();

    /* Module Definition */

    window.Queiroz = Queiroz;

})(window);


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
        //return new Date(2018,8,19,17,00); // => for TEST
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
    Element.prototype.data = function(name, value) {
        if (value)
            return this.setAttribute(name, value);
        else
            return this.getAttribute(name)
    };
    String.prototype.contains = function(str) {
        return this.indexOf(str) > -1;
    };

})();


/*!
 * Queiroz.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(localStorage, Queiroz) {

    /* Class Definition */

    var Settings = function() {

        /* Variables and Constants */

        var
            NAME = 'settings',
            DEFAULT = JSON.parse('{"_static_":{"userscriptDelay":1000,"maxConsecutiveMinutes":360,"maxDailyMinutes":600,"dailyGoalMinutes":{"0":0,"1":528,"2":528,"3":528,"4":528,"5":528,"6":0},"initialWeekday":1,"gaTrackingId":"UA-105390656-1","qzKeepalive":60000,"ksKeepalive":1200000,"noticeRangeMinutes":[15,5,3,1],"notice_icon":"https://github.com/viniciusknob/queiroz.js/raw/master/src/img/ic_notification.png"},"_mutable_":{"hideLastWeekDays":true}}'),
            KEY = {
                hideLastWeekDays: 'hideLastWeekDays'
            },
            cache = {};

        /* Private Functions */

        var
            _persistCache = function() {
                localStorage.setItem(NAME, JSON.stringify(cache));
            },
            _hideLastWeekDays = function(enable) {
                if (typeof enable === 'boolean') {
                    cache[KEY.hideLastWeekDays] = enable;
                    _persistCache();
                    return;
                }

                var value = cache[KEY.hideLastWeekDays];
                if (typeof value === 'boolean')
                    return cache[KEY.hideLastWeekDays];

                return DEFAULT._mutable_.hideLastWeekDays;
            },
            _isWorkDay = function(date) {
                var day = date.getDay();
                return DEFAULT._static_.dailyGoalMinutes[day] > 0;
            };


        // Initialize cache
        if (localStorage.hasItem(NAME)) {
            cache = JSON.parse(localStorage.getItem(NAME));
        }

        /* Public API */

        return {
            USERSCRIPT_DELAY: DEFAULT._static_.userscriptDelay,
            MAX_CONSECUTIVE_MINUTES: DEFAULT._static_.maxConsecutiveMinutes,
            MAX_DAILY_MINUTES: DEFAULT._static_.maxDailyMinutes,
            DAILY_GOAL_MINUTES: DEFAULT._static_.dailyGoalMinutes,
            INITIAL_WEEKDAY: DEFAULT._static_.initialWeekday,
            GA_TRACKING_ID: DEFAULT._static_.gaTrackingId,
            QZ_KEEPALIVE: DEFAULT._static_.qzKeepalive,
            KS_KEEPALIVE: DEFAULT._static_.ksKeepalive,
            NOTICE_RANGE_MINUTES: DEFAULT._static_.noticeRangeMinutes,
            NOTICE_ICON: DEFAULT._static_.notice_icon,
            hideLastWeekDays: _hideLastWeekDays,
            isWorkDay: _isWorkDay
        };

    }();

    /* Module Definition */

    Queiroz.module.settings = Settings;

})(localStorage, window.Queiroz);

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
        Settings = Queiroz.module.settings,
        trackerName = 'qzTkr';

    ga('create', Settings.GA_TRACKING_ID, 'auto', trackerName);

    ga(trackerName+'.set', {
        appName: Queiroz.name,
        appVersion: Queiroz.version
    });

    ga(trackerName+'.send', 'screenview', {
        screenName: document.querySelector('.PageTitle').textContent
    });

})(window.Queiroz, window.ga);


/*!
 * Queiroz.js: kairos.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Class Definition */

    var Kairos = function() {
        return {
            reload: function() {
                window.location.reload(true);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.kairos = Kairos;

})(window, window.Queiroz);

/*!
 * Queiroz.js: keepalive.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(setTimeout, clearTimeout, setInterval, clearInterval, Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Kairos   = mod.kairos;

    /* Class Definition */

    var KeepAlive = function() {

        var
            _qzTimeOut = false,
            _ksTimeOut = false;

        /* Private Functions */

        var
            _clear = function() {
                if (_qzTimeOut)
                    clearInterval(_qzTimeOut);

                if (_ksTimeOut)
                    clearTimeout(_ksTimeOut);

                _qzTimeOut = false;
                _ksTimeOut = false;
            },
            _init = function() {
                if (_qzTimeOut && _ksTimeOut)
                    return;

                _clear();

                if (Settings.QZ_KEEPALIVE)
                    _qzTimeOut = setInterval(Queiroz.reload, Settings.QZ_KEEPALIVE);

                if (Settings.KS_KEEPALIVE)
                    _ksTimeOut = setTimeout(Kairos.reload, Settings.KS_KEEPALIVE);
            };

        /* Private Functions */

        return {
            init: _init,
            update: function(observable, args) { // Observer Pattern
                if (args.isActive)
                    _clear();
                else
                    _init();
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.keepalive = KeepAlive;

})(setTimeout, clearTimeout, setInterval, clearInterval, window.Queiroz);


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

    Strings._ = JSON.parse('{"pending":"Pendente","extra":"Extra","balance":"Saldo do dia","totalBalance":"Saldo Total","labor":"Efetuado","shift":"_n_&ordm; Turno","working":"Trabalhando...","exit":"Atinge _s_","exit+":"Meta + Saldo","config":"Config","weeklyGoal":"Meta Semanal","dailyGoal":"Meta do dia","timeOn":"Falta Abonada","mockTime":"Mock Time","notice":"Notificações","noticeMaxConsecutive":"Em _min_min você atingirá 6h de trabalho sem intervalo","noticeDailyGoal":"Em _min_min você completará a Meta Diária de 8h48","noticeBalancedLeave":"Em _min_min seu saldo total de horas será zerado","noticeMaxDaily":"Em _min_min você atingirá 10h, o máximo permitido por dia","noticeWeeklyGoal":"Em _min_min você completará a Meta Semanal de 44h","menuIcon":"&#9776;","menuItemHideLastWeekDays":"Ocultar dias da semana anterior","menuItemSupport":"Apoie este projeto","menuItemAbout":"Sobre"}');

    /* Module Definition */

    Queiroz.module.strings = Strings;

})(window.Queiroz);


/*!
 * Queiroz.js: style.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Style = function() {
        return {
            CSS: 'html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}#SemanaApontamentos{cursor:default!important}.ContentTable{margin-top:inherit}.FilledSlot,.LastSlot,.emptySlot{height:inherit;padding:5px}.FilledSlot span{margin:inherit!important}.qz-text-center{text-align:center}.qz-text-left{text-align:left}.qz-text-primary{color:brown}.qz-text-golden{color:#b8860b}.qz-text-green{color:green}.qz-text-teal{color:teal}.qz-text-black{color:#000}.qz-text-purple{color:#639}.qz-text-orange{color:#e27300}.qz-box{padding:5px 10px;margin:5px 1px;border:#a9a9a9 1px solid;min-width:60px}.qz-box-compact{min-width:auto}.qz-box-inline{display:inline-block}.qz-box-head{float:right}.qz-box-icon{min-width:auto;font-size:25px;border:initial}.qz-box-muted{background-color:#d3d3d3}.qz-box .qz-box-content{vertical-align:middle}.qz-box-with-fa-se{margin:0 0 0 5px}.qz-help-text{font-size:10px}.qz-input-time{height:13px;width:45px;text-align:center;padding:2px;margin:5px 0}.qz-input-error{border-color:red}.qz-fa{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;user-select:none}.qz-fa-se{float:right;margin:-10px -8px 0 0}.qz-fa-sw{float:left;margin:-10px 0 0 -8px}.qz-fa-se2{float:right;margin:5px -8px 0 0}.qz-toggle{margin-top:10px}.fa-toggle-on{color:green}.fa-toggle-off{color:grey}.js-show{display:block}.js-hide{display:none}.fa-chevron-down,.fa-chevron-up{margin:0 2.5px}.qz-dropdown{position:relative}.qz-dropdown-content{display:none;position:absolute;background-color:#f9f9f9;border:#a9a9a9 1px solid;box-shadow:0 4px 8px 0 rgba(0,0,0,.2);padding:2px;z-index:1024}.qz-dropdown:hover .qz-dropdown-content{display:block}.qz-dropdown-content p{font-weight:400;padding:5px;font-size:11px}.qz-dropdown-content p:hover{background-color:khaki}.qz-menu{min-width:200px;left:-160px}.qz-menu-item-icon{margin-right:4px;vertical-align:text-top}.qz-menu-item-icon-rg{float:right;margin:-1px}.qz-menu-item-anchor{color:inherit;cursor:inherit}.qz-column-menu{margin-right:10px;vertical-align:text-bottom;display:inline}.qz-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1024;background-color:rgba(0,0,0,.5)}.qz-modal-dialog{position:relative;width:900px;margin:30px auto}.qz-modal-content{position:relative;background-color:#fff;background-clip:padding-box;border-radius:5px}.qz-modal-header{padding:10px;border-bottom:1px solid #d3d3d3;font-weight:700;font-size:16px}.qz-modal-close{float:right;cursor:pointer;background:0 0;border:0;padding:0;color:silver}.qz-modal-body{padding:10px}.qz-modal-footer{padding:10px;border-top:1px solid #d3d3d3;text-align:center}'
        };
    }();

    /* Module Definition */

    Queiroz.module.style = Style;

})(window.Queiroz);

/*!
 * Queiroz.js: time.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Class Definition */

    var Time = function() {

        /* Constants */

        var
            ZERO_TIME = '00:00',
            MINUTE_IN_MILLIS = 1000 * 60,
            HOUR_IN_MILLIS = MINUTE_IN_MILLIS * 60;

        /* Private Functions */

        var
            _diff = function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() - init.getMillis();
                } else {
                    return end - init;
                }
            },
            _before =  function(init, end) {
                if (init instanceof Date && end instanceof Date) {
                    return end.getMillis() > init.getMillis();
                } else {
                    return end > init;
                }
            },
            _hourToMillis = function(hour) {
                return hour * HOUR_IN_MILLIS;
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
            };

        /* Public Functions */

        return {
            zero: ZERO_TIME,
            diff: _diff,
            before: _before,
            hourToMillis: _hourToMillis,
            minuteToMillis: _minuteToMillis,
            millisToMinute: _millisToMinute,
            millisToHuman: _millisToHuman,
            millisToHumanWithSign: _millisToHumanWithSign,
            humanToMillis: _humanToMillis
        };
    }();

    /* Module Definition */

    Queiroz.module.time = Time;

})(window.Queiroz);


/*!
 * Queiroz.js: dailygoal.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(localStorage, Queiroz) {

    /* Dependencies */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Time     = mod.time;

    /* Class Definition */

    var DailyGoal = function() {

        var
            NAME = "dailyGoalMinutes",
            cache = {},
            _observers = [];

        /* Private Functions */

        var
            _persistCache = function() {
                localStorage.setItem(NAME, JSON.stringify(cache));
            },
            _buildKey = function(date) {
                return date.getDay();
            },
            _get = function(key) {
                var minutes = cache[key]; // custom

                if (!!minutes == false)
                    minutes = Settings.DAILY_GOAL_MINUTES[key]; // default

                return minutes;
            },
            _add = function(eDate, eTime) {
                var time = Time.humanToMillis(eTime);
                if (!!time == false)
                    return false;

                var
                  date = Date.parseKairos(eDate + " " + Time.zero),
                  key = _buildKey(date);

                cache[key] = Time.millisToMinute(time);

                _persistCache();
                return true;
            },
            _addObserver = function(observer) { // Observer Pattern
                _observers.push(observer);
            },
            _notifyObservers = function(enable) { // Observer Pattern
                _observers.forEach(function(observer) {
                    observer.update(DailyGoal, { isActive: enable });
                });
            },
            _activate = function() { // Observer Pattern
                _notifyObservers(true);
            },
            _deactivate = function() { // Observer Pattern
                _notifyObservers(false);
            },
            _computeWeeklyGoalMinutes = function() {
                var weeklyGoalMinutes = 0;
                var keys = Object.keys(Settings.DAILY_GOAL_MINUTES);
                keys.forEach(function(key) {
                    var minutes = _get(key);
                    weeklyGoalMinutes += minutes;
                });
                return weeklyGoalMinutes;
            };

        // Initialize cache
        if (localStorage.hasItem(NAME)) {
            cache = JSON.parse(localStorage.getItem(NAME));
        }

        /* Public Functions */

        return {
            add: _add,
            get: _get,
            addObserver: _addObserver,
            activate: _activate,
            deactivate: _deactivate,
            computeWeeklyGoalMinutes: _computeWeeklyGoalMinutes
        };
    }();

    /* Module Definition */

    Queiroz.module.dailygoal = DailyGoal;

})(localStorage, window.Queiroz);

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
        DailyGoal = mod.dailygoal;

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
                var currentWeekDay = Date.now().getDay(); // 0 = Sunday, 1 = Monday,...
                var fixedCurrentWeekDay = currentWeekDay === 0 ? 7 : currentWeekDay; // DimepKairos starts on monday, then sunday should be controlled different.
                var weeklyGoal = _computeWeeklyGoalMinutesInMillis();

                if (days.length === fixedCurrentWeekDay)
                    return weeklyGoal;

                var workedDays = [];
                days.forEach(function(day) {
                    workedDays.push(day.date.getDay());
                });

                var millisOff = 0;
                for (let idx = 1; idx <= fixedCurrentWeekDay; idx++) {
                     let fixedIdx = idx === 7 ? 0 : idx; // use native day of week
                     if (workedDays.contains(fixedIdx) == false)
                         millisOff += _computeDailyGoalMinutesInMillis(fixedIdx);
                }

                return weeklyGoal - millisOff;
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
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.viewtime = ViewTime;

})(window.Queiroz);


/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Kairos   = mod.kairos,
        Strings  = mod.strings,
        Style    = mod.style;

    /* Class Definition */

    var Snippet = function() {

        /* Constants */

        var
            TagName = {
                BR: 'br',
                DIV: 'div',
                A: 'a',
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
                TD: 'td',
                INPUT: 'input'
            };

        var
            _buildTag = function(name, clazz, text) {
                var element = document.createElement(name);
                if (clazz) {
                    element.className = clazz;
                }
                if (text) {
                    element.innerHTML = text;
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
            _buildEditableBox = function(options) {
                options.init();

                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center js-has-edit-box');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', options.helpText);
                var divInput = _buildTag(TagName.DIV);
                var inputTime = _buildTag(TagName.INPUT, 'qz-input-time js-input-time');
                var cancel = _buildTag(TagName.SPAN,'qz-fa qz-fa-sw fa fa-times');
                var save = _buildTag(TagName.SPAN,'qz-fa qz-fa-se qz-text-green fa fa-floppy-o');

                inputTime.setAttribute('maxlength',5);
                inputTime.setAttribute('placeholder','00:00');

                inputTime.onkeyup = function() {
                    var _in = this.value;

                    this.classList.remove("qz-input-error");

                    if (/^[0-9:]*$/.test(_in) == false)
                        this.classList.add("qz-input-error");

                    if (_in.length == 3)
                        if (/^\d{3}$/.test(_in))
                            this.value = _in[0] + _in[1] + ":" + _in[2];
                };

                cancel.onclick = function() {
                    options.finally();
                    this.parentElement.remove();
                };
                save.onclick = function() {
                    var eDay = this.parentElement.parentElement;
                    var eTime = eDay.querySelector('.js-input-time');

                    var vTime = eTime.value;
                    if (/\d{2}:\d{2}/.test(vTime) == false) {
                        eTime.classList.add("qz-input-error");
                        return;
                    }

                    options.finally();
                    var vDate = eDay.querySelector('[id^=hiddenDiaApont]').value;
                    options.save(vDate, vTime);
                };

                box.appendChild(helpText);
                divInput.appendChild(inputTime);
                box.appendChild(divInput);
                box.appendChild(cancel);
                box.appendChild(save);
                return box;
            },
            _buildMockTime = function(options) {
                var
                    div = _buildTag(TagName.DIV, 'FilledSlot qz-text-primary'),
                    spanTime = _buildTag(TagName.SPAN, 'Time'+options.direction, options.mockTime),
                    spanRemove = _buildTag(TagName.SPAN,'qz-fa qz-fa-se fa fa-times');

                div.data('data-key', options.key);
                div.data('data-mocktime', options.mockTime);

                spanRemove.onclick = function() {
                    var
                        e = this.parentElement,
                        eDate = e.data('data-key'),
                        mockTime = e.data('data-mocktime');

                    options.remove(eDate, mockTime);
                    options.finally();
                };

                div.appendChild(spanTime);
                div.appendChild(spanRemove);
                return div;
            },
            _buildHeaderMenuBox = function() {
                var box = _buildTag(TagName.DIV, 'qz-box qz-box-icon qz-box-inline qz-dropdown', Strings('menuIcon'));
                var menu = _buildTag(TagName.DIV, 'qz-dropdown-content qz-menu');

                // hideLastWeekDays
                var hideLastWeekDays = _buildTag(TagName.P, 'qz-text-left', Strings('menuItemHideLastWeekDays'));
                hideLastWeekDays.onclick = function() {
                    var state = Settings.hideLastWeekDays();
                    Settings.hideLastWeekDays(!state);
                    Kairos.reload();
                };
                var state = Settings.hideLastWeekDays() ? 'on' : 'off';
                var enable = _buildTag(TagName.SPAN, 'fa fa-toggle-'+state+' qz-menu-item-icon-rg');
                hideLastWeekDays.appendChild(enable);
                menu.appendChild(hideLastWeekDays);
                // end hideLastWeekDays

                // support
                var support = _buildTag(TagName.P, 'qz-text-left');
                var icon = _buildTag(TagName.SPAN, 'fa fa-heart qz-menu-item-icon');
                support.appendChild(icon);
                var linkSupport = _buildTag(TagName.A, 'qz-menu-item-anchor', Strings('menuItemSupport'));
                linkSupport.href = 'https://github.com/viniciusknob/queiroz.js/blob/master/SUPPORT.md';
                linkSupport.target = '_blank';
                support.onclick = function() {
                    linkSupport.click();
                };
                support.appendChild(linkSupport);
                menu.appendChild(support);
                // end support

                // about
                var about = _buildTag(TagName.P, 'qz-text-left');
                var linkGitHub = _buildTag(TagName.A, 'qz-menu-item-anchor', Strings('menuItemAbout'));
                linkGitHub.href = 'https://github.com/viniciusknob/queiroz.js';
                linkGitHub.target = '_blank';
                about.onclick = function() {
                    linkGitHub.click();
                };
                about.appendChild(linkGitHub);
                menu.appendChild(about);
                // end about

                box.appendChild(menu);
                return box;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.DIV, 'qz-box-head');
            },
            buildToggleForDayOff: function(key) {
                return _buildTag(TagName.SPAN, 'fa fa-toggle-'+key+' qz-toggle');
            },
            buildDayOptions: function(TimeOn, MockTime) {
                var dropdown = _buildTag(TagName.DIV, 'qz-dropdown qz-column-menu');
                var icon = _buildTag(TagName.SPAN, 'fa fa-bars qz-text-teal');
                var content = _buildTag(TagName.DIV, 'qz-dropdown-content');
                var addTimeOn = _buildTag(TagName.P, 'qz-text-left', ':: Abonar Falta');
                var addMockTime = _buildTag(TagName.P, 'qz-text-left', ':: Mock Time');

                addTimeOn.onclick = function() {
                    var eDay = this.parentElement.parentElement.parentElement.parentElement;
                    if (eDay.querySelector('.js-has-edit-box'))
                        return;

                    window.scrollTo(0, 300);
                    setTimeout(function() {
                        var options = {
                            'helpText': Strings('timeOn'),
                            'init': TimeOn.activate,
                            'finally': TimeOn.deactivate,
                            'save': function(eDate, eTime) {
                                if (TimeOn.add(eDate, eTime))
                                    Queiroz.reload();
                            }
                        };
                        eDay.appendChild(_buildEditableBox(options));
                    }, 250);
                };

                addMockTime.onclick = function() {
                    var eDay = this.parentElement.parentElement.parentElement.parentElement;
                    if (eDay.querySelector('.js-has-edit-box'))
                        return;

                    window.scrollTo(0, 300);
                    setTimeout(function() {
                        var options = {
                            'helpText': Strings('mockTime'),
                            'init': MockTime.activate,
                            'finally': MockTime.deactivate,
                            'save': function(eDate, eTime) {
                                if (MockTime.add(eDate, eTime))
                                    Queiroz.reload();
                            }
                        };
                        eDay.appendChild(_buildEditableBox(options));
                    }, 250);
                };

                dropdown.appendChild(icon);
                dropdown.appendChild(content);
                content.appendChild(addTimeOn);
                content.appendChild(addMockTime);
                return dropdown;
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
            headerNoticeStatus: function(Notice) {
                var box = _buildBox({
                    helpText: 'notice',
                    humanTime: Notice.isGranted() ? 'ON' : 'OFF',
                    contentClass: 'qz-text-' + (Notice.isGranted() ? 'green' : 'primary'),
                    inlineText: true
                });
                box.onclick = function() {
                    if (Notice.isGranted() == false)
                        Notice.requestPermission();
                }
                return box;
            },
            balanceTimePerDay: function(balanceTime, total) {
                return _buildBox({
                    helpText: (total ? 'totalB' : 'b') + 'alance',
                    humanTime: balanceTime,
                    contentClass: 'qz-text-'+ (total ? 'purple' : 'teal')
                });
            },
            dailyGoal: function(dailyGoal, DailyGoal) {
                var box = _buildBox({
                    helpText: 'dailyGoal',
                    humanTime: dailyGoal,
                    contentClass: 'qz-text-black qz-box-with-fa-se'
                });
                var edit = _buildTag(TagName.SPAN,'qz-fa qz-fa-se2 fa fa-edit');

                edit.onclick = function() {
                  var eDay = this.parentElement.parentElement;
                  if (eDay.querySelector('.js-has-edit-box'))
                      return;

                  window.scrollTo(0, 300);
                  setTimeout(function() {
                      var options = {
                          'helpText': Strings('dailyGoal'),
                          'init': DailyGoal.activate,
                          'finally': DailyGoal.deactivate,
                          'save': function(eDate, eTime) {
                              if (DailyGoal.add(eDate, eTime))
                                  Queiroz.reload();
                          }
                      };
                      eDay.appendChild(_buildEditableBox(options));
                  }, 250);
                };

                box.appendChild(edit);
                return box;
            },
            laborTimePerDay: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green'
                });
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
            todayTimeToLeave: function(timeToLeave, balanced, basedOn) {
                var box = _buildBox({
                    helpText: 'exit' + (balanced ? '+' : ''),
                    humanTime: timeToLeave,
                    contentClass: 'qz-text-primary'
                });
                if (balanced == false) {
                    var help = box.querySelector('.qz-help-text');
                    var text = help.textContent.replace('_s_', basedOn);
                    help.textContent = text;
                }
                return box;
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
            },
            buildMockTime: _buildMockTime,
            buildHeaderMenuBox: _buildHeaderMenuBox
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, window.Queiroz);


/*!
 * Queiroz.js: dayoff.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(storage, Queiroz) {

    /* Class Definition */

    var DayOff = function() {

        var
            OLD_NAME = "dayoff", // version <= 3.1.22
            NAME = "dayOff", // version >= 3.1.23
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
                storage.setItem(NAME, JSON.stringify(cache));
            },
            _remove = function(date) {
                if (_is(date) == false)
                    return;

                var index = cache.indexOf(_buildValue(date));
                cache.splice(index, 1);
                storage.setItem(NAME, JSON.stringify(cache));
            };

        /* Initialize Cache */

        if (storage.hasItem(OLD_NAME)) { // version <= 3.1.22
            cache = JSON.parse(storage.getItem(OLD_NAME));
            storage.setItem(NAME, JSON.stringify(cache));
            storage.removeItem(OLD_NAME);
        } else {
            if (storage.hasItem(NAME)) { // version >= 3.1.23
                cache = JSON.parse(storage.getItem(NAME));
            }
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

    /* Module Definition */

    Queiroz.module.dayoff = DayOff;

})(localStorage, window.Queiroz);


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
            cache = {},
            _observers = [];

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
            },
            _notifyObservers = function(enable) { // Observer Pattern
                _observers.forEach(function(observer) {
                    observer.update(TimeOn, { isActive: enable });
                });
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
            },
            addObserver: function(observer) { // Observer Pattern
                _observers.push(observer);
            },
            activate: function() { // Observer Pattern
                _notifyObservers(true);
            },
            deactivate: function() { // Observer Pattern
                _notifyObservers(false);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.timeon = TimeOn;

})(localStorage, window.Queiroz);


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


/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
        mod       = Queiroz.module,
        Settings  = mod.settings,
        Snippet   = mod.snippet,
        TimeOn    = mod.timeon,
        DailyGoal = mod.dailygoal,
        Notice    = mod.notice;

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
                HEADER_DAY: '.weekDayTextSize',
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
          _getDisplayedDays = function() {
              var
                  days = [],
                  eColumns = _getAll(Selector.COLUMN_DAY);

              eColumns.forEach(function(eDay) {
                  days.push(_get(Selector.DATE, eDay).value);
              });

              return days; // [dd_mm_yyyy,dd_mm_yyyy,...]
          },
          _injectTimes = function(MockTime) {
              var eColumns = _getAll(Selector.COLUMN_DAY);

              eColumns.forEach(function(eDay) {
                  var eDate = _get(Selector.DATE, eDay).value;
                  if (MockTime.has(eDate)) {
                      var
                          eCheckpoints = _getAll(Selector.CHECKPOINT, eDay),
                          length = eCheckpoints.length;

                      MockTime.get(eDate).forEach(function(time, index) {
                          var
                              pair = (length + (index+1)) % 2 == 0,
                              direction = pair ? 'OUT' : 'IN', // 1=IN, 2=OUT, 3=IN, 4=OUT...
                              options = {
                                  'key': eDate,
                                  'mockTime': time,
                                  'direction': direction,
                                  'remove': MockTime.remove,
                                  'finally': function() {
                                      Queiroz.reload();
                                  }
                              };

                          eDay.appendChild(Snippet.buildMockTime(options));
                      });
                  }
              });
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
            hideLastWeekDays: function(data) {
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
                            if (day.timeOn) {
                                eDay.appendChild(TimeOn.buildBox(day.timeOn));
                            }
                            if (day.periods.length) {
                                var isWorkDay = Settings.isWorkDay(day.date);
                                day.periods.forEach(function(time, index) {
                                    if (!!time.out || (time.out == false && day.date.isToday()))
                                        eDay.appendChild(Snippet.laborTimePerShift(time.shift, (!!time.out), (index+1)));
                                });
                                if (isWorkDay) {
                                    eDay.appendChild(Snippet.dailyGoal(day.goal, DailyGoal));
                                }
                                eDay.appendChild(Snippet.laborTimePerDay(day.worked, TimeOn));
                                if (isWorkDay) {
                                    eDay.appendChild(Snippet.balanceTimePerDay(day.balance, false));
                                }
                                if (day.date.isToday() == false || isWorkDay == false) {
                                    eDay.appendChild(Snippet.balanceTimePerDay(day.totalBalance, true));
                                }
                                day.periods.forEach(function(time) {
                                    if (time.out == false && day.date.isToday()) {
                                        time.orderBy.forEach(function(variable) {
                                            var specificTime = time[variable];
                                            if (!!specificTime == false)
                                                return;

                                            if (isWorkDay) {
                                                if (variable == 'leave')
                                                    eDay.appendChild(Snippet.todayTimeToLeave(specificTime, false, day.goal));
                                                if (variable == 'balancedLeave')
                                                    eDay.appendChild(Snippet.todayTimeToLeave(specificTime, true));
                                            }
                                            if (variable == 'leaveMaxConcec')
                                                eDay.appendChild(Snippet.todayTimeToLeave(specificTime, false, data.maxConsecutive));
                                            if (variable == 'leaveMaxDaily')
                                                eDay.appendChild(Snippet.todayTimeToLeave(specificTime, false, data.maxDaily));
                                        });
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
                header.appendChild(Snippet.headerNoticeStatus(Notice));
                header.appendChild(Snippet.buildHeaderMenuBox());
                View.appendToHeader(header);
            },
            isLoaded: function() {
                return _get(Selector.COLUMN_DAY);
            },
            isTargetOnVacation: function(target) {
                var e = _get(Selector.TOOGLE, target).parentElement;
                if (!!e == false)
                    return false;

                var div = e.firstElementChild;
                if (!!div == false || div.tagName != 'DIV')
                    return false;

                var span = div.firstElementChild;
                if (!!span == false || span.tagName != 'SPAN')
                    return false;

                return span.innerText == 'Férias';
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
            getHeadersDay: function(target) {
                return _getAll(Selector.HEADER_DAY, target);
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
            },

            getDisplayedDays: _getDisplayedDays,
            injectTimes: _injectTimes
        };
    }();

    /* Module Definition */

    Queiroz.module.view = View;

})(document, window.Queiroz);


/*!
 * Queiroz.js: mocktime.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(localStorage, Queiroz) {

    /* Dependencies */

    var
        mod  = Queiroz.module,
        Time = mod.time,
        View = mod.view;

    /* Class Definition */

    var MockTime = function() {

        /* Variables and Constants */

        var
            NAME = "mockTime",
            cache = {},
            _observers = [];

        /* Private Functions */

        var
            _persistCache = function() {
                localStorage.setItem(NAME, JSON.stringify(cache));
            },
            _buildKey = function(date) {
                return date.getDate().padStart(2) + "/" + date.getFixedMonth().padStart(2);
            },
            _get = function(date) {
                if (typeof date === 'string')
                    date = Date.parseKairos(date + " " + Time.zero);

                return cache[_buildKey(date)];
            },
            _has = function(date, mockTime) {
                if (!!date == false)
                    return false;

                if (typeof date === 'string')
                    date = Date.parseKairos(date + " " + Time.zero);

                var cachedDate = cache[_buildKey(date)];
                if (!!cachedDate == false)
                    return false;

                if (date && mockTime) {
                    var
                        found = false,
                        timeArr = _get(date);

                    timeArr.forEach(function(time) {
                        if (mockTime == time)
                            found = true;
                    });

                    return found;
                } else {
                    return !!cachedDate;
                }
            },
            _inject = function() {
                View.injectTimes(MockTime);
            },
            _add = function(eDate, eTime) {
                var time = Time.humanToMillis(eTime);
                if (!!time == false)
                    return false;

                var
                    date = Date.parseKairos(eDate + " " + Time.zero),
                    key = _buildKey(date);

                if (_has(date) == false)
                    cache[key] = [];
                else if (_has(date, eTime))
                    return true;

                cache[key].push(eTime);

                _persistCache();

                return true;
            },
            _remove = function(date, mockTime) {
                if (typeof date === 'string')
                    date = Date.parseKairos(date + " " + Time.zero);

                if (_has(date, mockTime) == false)
                    return;

                var key = _buildKey(date);
                if (_get(date).length == 1) {
                    delete cache[key];
                } else {
                    var
                        newTimeArr = [],
                        timeArr = _get(date);

                    timeArr.forEach(function(time) {
                        if (mockTime != time)
                            newTimeArr.push(time);
                    });

                    cache[key] = newTimeArr;
                }

                _persistCache();
            },
            _addObserver = function(observer) { // Observer Pattern
                _observers.push(observer);
            },
            _notifyObservers = function(enable) { // Observer Pattern
                _observers.forEach(function(observer) {
                    observer.update(MockTime, { isActive: enable });
                });
            },
            _activate = function() { // Observer Pattern
                _notifyObservers(true);
            },
            _deactivate = function() { // Observer Pattern
                _notifyObservers(false);
            };


        // Initialize cache
        if (localStorage.hasItem(NAME)) {
            cache = JSON.parse(localStorage.getItem(NAME));
        }

        /* Public Functions */

        return {
            injectIfExists: _inject,
            has: _has,
            get: _get,
            add: _add,
            remove: _remove,
            addObserver: _addObserver,
            activate: _activate,
            deactivate: _deactivate
        };

    }();

    /* Module Definition */

    Queiroz.module.mocktime = MockTime;

})(localStorage, window.Queiroz);


/*!
 * Queiroz.js: core.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Modules */

    var
        mod       = Queiroz.module,
        Settings  = mod.settings,
        Time      = mod.time,
        ViewTime  = mod.viewtime,
        KeepAlive = mod.keepalive,
        MockTime  = mod.mocktime,
        DailyGoal = mod.dailygoal,
        Snippet   = mod.snippet,
        View      = mod.view,
        DayOff    = mod.dayoff,
        TimeOn    = mod.timeon,
        Notice    = mod.notice;

    /* Private Functions */

    var
        _buildToggleForDayOff = function(day) {
            var state = DayOff.is(day) ? 'off' : 'on';
            var eToggle = Snippet.buildToggleForDayOff(state);
            eToggle.onclick = function() {
                var _day = day;
                if (DayOff.is(_day)) {
                    DayOff.remove(_day);
                } else {
                    DayOff.add(_day);
                }
                Queiroz.reload();
            };
            return eToggle;
        },
        _dataContains = function(data, eDay) {
            var eDate = View.getDateFromTargetAsString(eDay);
            var found = false;
            data.days.forEach(function(day) {
                if (day.date.getDateAsKairos() == eDate)
                    found = true;
            });
            return found;
        },
        _buildDayOffOption = function() {
            var active = false;
            View.getAllColumnDay().forEach(function(eDay) {
                var day = Date.parseKairos(View.getDateFromTargetAsString(eDay) + " " + Time.zero);

                if (day.getDay() === Settings.INITIAL_WEEKDAY)
                    active = true;

                if (active && Settings.isWorkDay(day)) {
                    if (View.isTargetOnVacation(eDay))
                        DayOff.add(day);

                    var eToggle = _buildToggleForDayOff(day);
                    View.appendToggle(eDay, eToggle);
                }
            });
        },
        _buildDayOptions = function(data) {
            _buildDayOffOption(data);
            View.getAllColumnDay().forEach(function(eDay) {
                var headersDay = View.getHeadersDay(eDay);
                var target = headersDay[0];
                headersDay[1].style.display = 'none';

                var options = {weekday:'short', day: '2-digit', month: '2-digit'};
                var day = Date.parseKairos(View.getDateFromTargetAsString(eDay) + " " + Time.zero);
                var dateString = day.toLocaleDateString('pt-BR', options);
                target.innerHTML = dateString;

                if (DayOff.is(day) == false && _dataContains(data, eDay)) {
                    target.insertBefore(Snippet.buildDayOptions(TimeOn, MockTime), target.firstChild);
                    target.querySelector('.qz-dropdown').onmouseover = function() {
                        var menu = target.querySelector('.qz-dropdown-content');
                        menu.style.minWidth = target.offsetWidth + 'px';
                    };
                }
            });
        },
        _removeDaysBeforeInicialWeekday = function(data) {
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
            MockTime.injectIfExists();
            var data = View.read();
            ViewTime.parse(data);
            _removeDaysBeforeInicialWeekday(data);

            if (Settings.hideLastWeekDays())
                View.hideLastWeekDays(data);

            DayOff.check(data);
            TimeOn.check(data);
            _buildDayOptions(data);
            ViewTime.compute(data);
            Notice.check(data);
            ViewTime.toHuman(data);
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

    Queiroz.bless = function() {
        if (View.isLoaded()) {
            _init();
        } else {
            _initWithDelay();
        }

        TimeOn.addObserver(KeepAlive);
        MockTime.addObserver(KeepAlive);
        DailyGoal.addObserver(KeepAlive);

        window.addEventListener('unload', Notice.closeFiredOnUnload);
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

        View.appendToBody('<div class="qz-modal"><div class="qz-modal-dialog"><div class="qz-modal-content"><div class="qz-modal-header">Queiroz.js 3.0 is coming <button class="qz-modal-close"><span class="fa fa-times"></span></button></div><div class="qz-modal-body qz-text-center"><h1>Coming soon!</h1></div><div class="qz-modal-footer"><small>Queiroz.js 3.7.52</small></div></div></div></div>', function() {
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

        _init();
    };

})(window, window.Queiroz);


/*!
 * Queiroz.js: autoexec.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

window.Queiroz.bless();
