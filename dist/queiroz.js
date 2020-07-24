
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
            VERSION = '3.8.53';

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
    Array.prototype.isEmpty = function() {
        return (!!this.length) === false;
    };

    /* Date API */

    // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/now
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
    Date.isLeapYear = function(year) { 
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
    };
    Date.getDaysInMonth = function(year, month) {
        return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };
    Date.prototype.isLeapYear = function() { 
        return Date.isLeapYear(this.getFullYear()); 
    };
    Date.prototype.getDaysInMonth = function() { 
        return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
    };
    Date.prototype.addMonths = function(value) {
        var n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        this.setDate(Math.min(n, this.getDaysInMonth()));
        return this;
    };
    Date.prototype.isToday = function() {
        var _now = Date.now();
        return this.getDayOfMonth() === _now.getDayOfMonth() &&
               this.getMonth() === _now.getMonth() &&
               this.getFullYear() === _now.getFullYear();
    };
    Date.prototype.getPrevFixedMonth = function() {
        let fixedMonth = this.getFixedMonth();
        return fixedMonth == 1 ? 12 : (fixedMonth - 1);
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
    Date.prototype.toDDmmYYYY = function(separator) {
        let
            day = this.getDayOfMonth().padStart(2),
            month = this.getFixedMonth().padStart(2),
            year = this.getFullYear();
        
        return [day, month, year].join(separator);
    };
    Date.prototype.isCurrentWeek = function(initialWeekDay) {
        // initialWeekDay: 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        let millis = Date.now() - this;
        let days = parseInt(millis / 1000 / 60 / 60 / 24);
        if (days > 7)
            return false;
        
        let currentWeekDay = Date.now().getDay();
        let targetWeekDay = this.getDay();
        
        return (initialWeekDay <= targetWeekDay && targetWeekDay <= currentWeekDay);
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
    String.prototype.capitalize = function() {
        if (this) 
            return this.charAt(0).toUpperCase() + this.slice(1)
        else 
            return this;
    }
    String.is = function(arg) {
        return typeof arg === 'string';
    }

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


        /* Constants */

        const
            BUSCAR_APONTAMENTOS_URL = '/Dimep/Ponto/BuscarApontamentos',
            BUSCAR_PEDIDOS_APONTAMENTO_URL = '/Dimep/PedidosJustificativas/BuscarPedidosApontamento';
        

        /* Private Functions */

        var
            _getURL = function() {
                let path = window.location.pathname;
                return /Ponto/.test(path) ? 
                    BUSCAR_APONTAMENTOS_URL : BUSCAR_PEDIDOS_APONTAMENTO_URL;
            };


        /* Public Functions */

        return {
            reload: function() {
                window.location.reload(true);
            },
            loadAppointments: function(code = 0) {
                window.dtoPessoaApontamentos.Week = code; // TODO create my own?
                return fetch(_getURL(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(window.dtoPessoaApontamentos)
                })
                .then(response => response.text())
                .then(plainText => new DOMParser().parseFromString(plainText, 'text/html'));
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

    Strings._ = JSON.parse('{"pending":"Pendente","extra":"Extra","balance":"Saldo do dia","totalBalance":"Saldo Total","labor":"Efetuado","loadingMonth":"Carregando...","shift":"_n_&ordm; Turno","working":"Trabalhando...","exit":"Atinge _s_","exit+":"Meta + Saldo","config":"Config","weeklyGoal":"Meta Semanal","dailyGoal":"Meta do dia","timeOn":"Falta Abonada","mockTime":"Mock Time","notice":"Notificações","noticeMaxConsecutive":"Em _min_min você atingirá 6h de trabalho sem intervalo","noticeDailyGoal":"Em _min_min você completará a Meta Diária de 8h48","noticeBalancedLeave":"Em _min_min seu saldo total de horas será zerado","noticeMaxDaily":"Em _min_min você atingirá 10h, o máximo permitido por dia","noticeWeeklyGoal":"Em _min_min você completará a Meta Semanal de 44h","menuIcon":"&#9776;","menuItemHideLastWeekDays":"Ocultar dias da semana anterior","menuItemSupport":"Apoie este projeto","menuItemAbout":"Sobre"}');

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
            CSS: 'html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,footer,header,nav,section{display:block}h1{font-size:2em;margin:.67em 0}figcaption,figure,main{display:block}figure{margin:1em 40px}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent;-webkit-text-decoration-skip:objects}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:inherit}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}dfn{font-style:italic}mark{background-color:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,optgroup,select,textarea{font-family:sans-serif;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=reset],[type=submit],button,html [type=button]{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{display:inline-block;vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details,menu{display:block}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}*{border-radius:.2rem!important}#filterContent form{display:inline-block}#filterContent>div:first-child>div:first-child{display:inline-block}#SemanaApontamentos{cursor:default!important}.ContentTable{margin-top:inherit}.FilledSlot,.LastSlot,.emptySlot{height:inherit;padding:5px}.FilledSlot span{margin:inherit!important}.qz-text-center{text-align:center}.qz-text-left{text-align:left}.qz-text-bold{font-weight:700!important}.qz-text-primary{color:brown}.qz-text-golden{color:#b8860b}.qz-text-green{color:green}.qz-text-teal{color:teal}.qz-text-black{color:#000}.qz-text-purple{color:#639}.qz-text-orange{color:#e27300}.qz-text-grey{color:grey}.qz-text-line-through{text-decoration:line-through}.qz-cursor-pointer{cursor:pointer}.qz-box{padding:5px 10px 4px;margin:2px 2px;border:#a9a9a9 1px solid;min-width:60px}.qz-box-compact{min-width:auto}.qz-box-inline{display:inline-block}.qz-box-period{display:inline-block;vertical-align:top;margin-top:-2px}.qz-box-period>.qz-box{min-width:100px}.qz-box-head{float:right}.qz-box-icon{min-width:auto;font-size:25px;border:initial}.qz-box-muted{background-color:#d3d3d3}.qz-box .qz-box-content{vertical-align:middle}.qz-box-with-fa-se{margin:0 0 0 5px}.qz-help-text{font-size:10px}.qz-input-time{height:13px;width:45px;text-align:center;padding:2px;margin:5px 0}.qz-input-error{border-color:red}.qz-fa{-moz-user-select:-moz-none;-khtml-user-select:none;-webkit-user-select:none;user-select:none}.qz-fa-se{float:right;margin:-10px -8px 0 0}.qz-fa-sw{float:left;margin:-10px 0 0 -8px}.qz-fa-se2{float:right;margin:0 -8px 0 0}.qz-fa-sw2{float:left;margin:0 0 0 -8px}.qz-fa-se3{float:right;margin:5px -8px 0 0}.qz-toggle{margin-top:10px}.fa-toggle-on{color:green}.fa-toggle-off{color:grey}.js-show{display:block}.js-hide{display:none}.qz-dropdown{position:relative}.qz-dropdown-content{display:none;position:absolute;background-color:#f9f9f9;border:#a9a9a9 1px solid;box-shadow:0 4px 8px 0 rgba(0,0,0,.2);padding:2px;z-index:1024}.qz-dropdown:hover .qz-dropdown-content{display:block}.qz-dropdown-content p{font-weight:400;padding:5px;font-size:11px}.qz-dropdown-content p:hover{background-color:khaki}.qz-menu{min-width:200px;left:-160px}.qz-menu-item-icon{margin-right:4px;vertical-align:text-top}.qz-menu-item-icon-rg{float:right;margin:-1px}.qz-menu-item-anchor{color:inherit;cursor:inherit}.qz-column-menu{margin-right:10px;vertical-align:text-bottom;display:inline}.qz-modal{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1024;background-color:rgba(0,0,0,.5)}.qz-modal-dialog{position:relative;top:50%;left:50%;transform:translate(-50%,-50%);width:800px}.qz-modal-content{position:relative;background-color:#fff;background-clip:padding-box;border-radius:5px}.qz-modal-header{padding:10px;border-bottom:1px solid #d3d3d3;font-weight:700;font-size:16px}.qz-modal-close{float:right;cursor:pointer;background:0 0;border:0;padding:0;color:silver}.qz-modal-body{padding:10px;height:600px;max-height:100%;overflow:auto}.qz-modal-footer{padding:10px;border-top:1px solid #d3d3d3;text-align:center}table{border-collapse:collapse}.qz-table{width:100%;margin-bottom:1rem;color:#212529}.qz-table td,.qz-table th{padding:.3rem;vertical-align:top;border-top:1px solid #dee2e6}.qz-table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6}.qz-table tbody+tbody{border-top:2px solid #dee2e6}.qz-table tbody tr:hover{color:#212529;background-color:rgba(0,0,0,.075)}'
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
            checkAndMark: function(data) {
                data.days.forEach(function(day) {
                    day.off = _is(day.date);
                });
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


/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, document, Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Kairos   = mod.kairos, // TODO remove, snippet should to create elements only
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
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings(options.helpText));
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
                var itemSupport = _buildTag(TagName.P, 'qz-text-left');
                var linkSupport = _buildTag(TagName.A, 'qz-menu-item-anchor');
                linkSupport.href = 'https://github.com/viniciusknob/queiroz.js/blob/master/SUPPORT.md'; // TODO settings?
                linkSupport.target = '_blank';
                var iconSupport = _buildTag(TagName.SPAN, 'fa fa-heart qz-menu-item-icon');
                var labelSupport = _buildTag(TagName.SPAN, '', Strings('menuItemSupport'));
                itemSupport.appendChild(iconSupport);
                itemSupport.appendChild(labelSupport);
                linkSupport.appendChild(itemSupport);
                menu.appendChild(linkSupport);
                // end support

                // about
                var itemAbout = _buildTag(TagName.P, 'qz-text-left');
                var linkGitHub = _buildTag(TagName.A, 'qz-menu-item-anchor');
                linkGitHub.href = 'https://github.com/viniciusknob/queiroz.js'; // TODO settings?
                linkGitHub.target = '_blank';
                var labelAbout = _buildTag(TagName.SPAN, '', Strings('menuItemAbout'));
                itemAbout.appendChild(labelAbout);
                linkGitHub.appendChild(itemAbout);
                menu.appendChild(linkGitHub);
                // end about

                box.appendChild(menu);
                return box;
            },
            _buildReportTable = function(month) {
                var table = _buildTag(TagName.TABLE, 'qz-table');
                
                var thead = _buildTag(TagName.THEAD);
                var trhead = _buildTag(TagName.TR);
                var thDate = _buildTag(TagName.TH);
                var thWorked = _buildTag(TagName.TH);

                thDate.textContent = 'Data';
                thWorked.textContent = 'Realizado';
                
                trhead.appendChild(thDate);
                trhead.appendChild(thWorked);
                
                thead.appendChild(trhead);
                table.appendChild(thead);
                
                var tbody = _buildTag(TagName.TBODY);
                
                var options = {weekday:'short', day: '2-digit', month: 'short', year: 'numeric'};

                month.weeks.forEach(week => {
                    week.days.forEach(day => {
                        var tr = _buildTag(TagName.TR);

                        if (day.periods.length === 0)
                            tr.classList.add('qz-text-grey');

                        if (day.off)
                            tr.classList.add('qz-text-line-through');

                        var tdDate = _buildTag(TagName.TD);
                        var tdWorked = _buildTag(TagName.TD);
    
                        tdDate.textContent = day.date.toLocaleDateString('pt-BR', options).replace(/\./g,'');
                        tdWorked.textContent = day.worked;
                        
                        tr.appendChild(tdDate);
                        tr.appendChild(tdWorked);
                        tbody.appendChild(tr);
                    });

                    // realizado na semana
                    var tr = _buildTag(TagName.TR, 'qz-text-bold');
                    var tdDate = _buildTag(TagName.TD);
                    var tdWorked = _buildTag(TagName.TD);

                    tdDate.textContent = 'Realizado na Semana';
                    tdWorked.textContent = week.worked;
                    
                    tr.appendChild(tdDate);
                    tr.appendChild(tdWorked);
                    tbody.appendChild(tr);

                    // saldo da semana
                    tr = _buildTag(TagName.TR, 'qz-text-bold');
                    tdDate = _buildTag(TagName.TD);
                    tdWorked = _buildTag(TagName.TD);

                    tdDate.textContent = 'Saldo da Semana';
                    tdWorked.textContent = week.weeklyBalance;
                    
                    tr.appendChild(tdDate);
                    tr.appendChild(tdWorked);
                    tbody.appendChild(tr);

                    // blank line
                    tr = _buildTag(TagName.TR);
                    tdDate = _buildTag(TagName.TD);
                    tdWorked = _buildTag(TagName.TD);

                    tdDate.textContent = '';
                    tdWorked.textContent = '-';
                    
                    tr.appendChild(tdDate);
                    tr.appendChild(tdWorked);
                    tbody.appendChild(tr);
                });

                // realizado no mês
                var tr = _buildTag(TagName.TR, 'qz-text-bold');
                var tdDate = _buildTag(TagName.TD);
                var tdWorked = _buildTag(TagName.TD);

                tdDate.textContent = 'Realizado no Mês';
                tdWorked.textContent = month.worked;
                
                tr.appendChild(tdDate);
                tr.appendChild(tdWorked);
                tbody.appendChild(tr);
                
                table.appendChild(tbody);
                return table;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.DIV, 'qz-box-head');
            },
            periodHeader: function() {
                return _buildTag(TagName.DIV, 'qz-box-period');
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
                            'helpText': 'timeOn',
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
                            'helpText': 'mockTime',
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
            buildIconRefreshModal: function() {
                return _buildTag(TagName.SPAN,'qz-fa qz-fa-sw2 fa fa-refresh qz-cursor-pointer');
            },
            buildIconOpenModal: function() {
                return _buildTag(TagName.SPAN,'qz-fa qz-fa-se2 fa fa-external-link qz-cursor-pointer');
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
            headerMonthLaborTime: function() {
                return _buildBox({
                    helpText: 'loadingMonth',
                    humanTime: '',
                    contentClass: 'fa fa-spinner fa-spin',
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
            dailyGoal: function(dailyGoal, DailyGoal) {
                var box = _buildBox({
                    helpText: 'dailyGoal',
                    humanTime: dailyGoal,
                    contentClass: 'qz-text-black qz-box-with-fa-se'
                });
                var edit = _buildTag(TagName.SPAN,'qz-fa qz-fa-se3 fa fa-edit');

                edit.onclick = function() {
                  var eDay = this.parentElement.parentElement;
                  if (eDay.querySelector('.js-has-edit-box'))
                      return;

                  window.scrollTo(0, 300);
                  setTimeout(function() {
                      var options = {
                          'helpText': 'dailyGoal',
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
            buildHeaderMenuBox: _buildHeaderMenuBox,
            buildReportTable: _buildReportTable
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(window, document, window.Queiroz);


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
                PERIOD_RANGE: '#PeriodoRange',
                PERIOD_HEADER: '#filterContent div',
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
            read: function(target) {
                var
                    data = {},
                    days = [],
                    eColumns = _getAll(Selector.COLUMN_DAY, target);

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
            getPeriodRange: function() {
                return _get(Selector.PERIOD_RANGE).textContent;
            },
            appendToHead: function(html) {
                _append(Selector.HEAD, html);
            },
            appendToBody: function(html, callback) {
                _append(Selector.BODY, html, callback);
            },
            appendToPeriodHeader: function(html, callback) {
                _append(Selector.PERIOD_HEADER, html, callback);
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
 * Queiroz.js: modal.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Modules */

    var
        mod = Queiroz.module,
        View = mod.view;

    /* Class Definition */

    var Modal = function() {

        var 
            MODAL = '<div class="qz-modal js-hide"><div class="qz-modal-dialog"><div class="qz-modal-content"><div class="qz-modal-header"><span class="qz-modal-title"></span> <button class="qz-modal-close"><span class="fa fa-times"></span></button></div><div class="qz-modal-body qz-text-center"></div><div class="qz-modal-footer"><span>Queiroz.js tem ajudado você? <i class="fa fa-heart"></i> <a target="_blank" href="https://github.com/viniciusknob/queiroz.js/blob/master/SUPPORT.md">Clique aqui</a> e apoie este projeto.</span></div></div></div></div>';


        /* Private Functions */

        var
            _getModal = function() {
                return document.querySelector('.qz-modal');
            },
            _setModalTitle = function(title) {
                document.querySelector('.qz-modal .qz-modal-title').textContent = title;
            },
            _getCloseButton = function() {
                return document.querySelector(".qz-modal-close");
            },
            _close = function(callback) {
                let modal = _getModal();
                modal.classList.remove('js-show');
                modal.classList.add('js-hide');
                if (callback) 
                    callback();
            },
            _open = function(modalTitle, callback, closeCallback) {
                let modal = _getModal();

                modal.classList.remove('js-hide');
                modal.classList.add('js-show');

                if (modalTitle)
                    _setModalTitle(modalTitle);
                if (closeCallback)
                    _getCloseButton().onclick = () => _close(closeCallback);
                if (callback) 
                    callback();
            },
            _asyncInit = async function() {
                View.appendToBody(MODAL, function() {
                    _getCloseButton().onclick = _close;
                });
            };


        /* Public Functions */

        return {
            init: _asyncInit,
            open: _open
        };
    }();

    /* Module Definition */

    Queiroz.module.modal = Modal;

})(window, window.Queiroz);


/*!
 * Queiroz.js: report.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(sessionStorage, Queiroz) {

    /* Modules */

    var
        mod = Queiroz.module,
        Settings = mod.settings,
        Strings  = mod.strings,
        Kairos = mod.kairos,
        Snippet = mod.snippet,
        Time = mod.time,
        DayOff = mod.dayoff,
        TimeOn = mod.timeon,
        View = mod.view,
        ViewTime = mod.viewtime,
        Modal = mod.modal;


    /* Class Definition */

    var Report = function() {

        const
            NAME = "periods";

        var
            _cache = {},
            _observers = [];


        /* Private Functions */


        // Observer Pattern
        
        var
            _notifyObservers = function(enable) {
                _observers.forEach(function(observer) {
                    observer.update(Report, { isActive: enable });
                });
            },
            _addObserver = function(observer) {
                _observers.push(observer);
            },
            _activate = function() {
                _notifyObservers(true);
            },
            _deactivate = function() {
                _notifyObservers(false);
            };
        
        // end Observer Pattern


        // Cache

        var
            _buildKey = function(date) {
                return date.getFixedMonth().padStart(2) + "_" + date.getFullYear();
            },
            _has = function(date) {
                let month = _cache[_buildKey(date)];
                if (month)
                    return Date.now().toDDmmYYYY("/") == month.lastModified; // o mes atual atualiza com mais frequencia
                
                return false;
            },
            _get = function(date) {
                return _cache[_buildKey(date)].days;
            },
            _persistCache = function(days) {
                let patterns = [];
                days.forEach(day => {
                    let
                        splittedDate = day.date.split("_"),
                        mm = splittedDate[1],
                        pattern = "_" + mm + "_";
                    
                    if (patterns.contains(pattern) == false)
                        patterns.push(pattern);
                });

                let months = [];
                patterns.forEach(pattern => {
                    months.push(days.filter(day => day.date.contains(pattern)));
                });

                months.forEach(daysOfMonth => {
                    let monthDate = Date.parseKairos(daysOfMonth.last().date + " " + Time.zero);
                    let key = _buildKey(monthDate);
                    let lastModified = Date.now().toDDmmYYYY("/");
                    _cache[key] = { lastModified, days: daysOfMonth };
                });

                sessionStorage.setItem(NAME, JSON.stringify(_cache));

                return days;
            },
            _deepCacheCleaning = function() {
                _cache = {};
                sessionStorage.removeItem(NAME);
            };


        // end Cache

        var
            _updateView = function(daysLength) {
                let periodRange = View.getPeriodRange();
                let period = ViewTime.parsePeriodRange(periodRange);
                let numMonths = (period.end.getMonth() - period.begin.getMonth()) + 1;
                let numDays = numMonths * 30;
                let percent = parseInt((daysLength / numDays) * 100);
                percent = percent > 100 ? 100 : percent;

                let span = document.querySelector('.qz-box-period > .qz-box > .qz-help-text');
                span.textContent = Strings('loadingMonth') + ' ' + percent + '%';
            },
            _loadCurrentPeriod = function(code = 0, days = []) {
                _updateView(days.length);
                return Kairos.loadAppointments(code)
                    .then(html => View.read(html))
                    .then(weekData => {
                        days = days.concat(weekData.days);
                        return weekData.days.length === 0;
                    })
                    .then(stop => stop ? days : _loadCurrentPeriod(code-1, days)); // TODO create second way to stop this recursive method
            },
            _getCurrentPeriod = function() {
                let months = [];
                let days = [];

                let periodRange = View.getPeriodRange();
                let period = ViewTime.parsePeriodRange(periodRange);

                let current = new Date(period.begin);
                let last = new Date(period.end);
                months.push(period.begin);
                while (current.getFixedMonth() != last.getFixedMonth()) {
                    months.push(new Date(current.addMonths(1)));
                }

                months.forEach(month => {
                    if (_has(month)) {
                        days = days.concat(_get(month));
                    }
                });

                if (days.isEmpty()) {
                    return _loadCurrentPeriod()
                        .then(days => _persistCache(days))
                        .then(_getCurrentPeriod);
                }

                return new Promise(resolve => resolve(days));
            },
            _preparePeriod = function(days) {
                let periodData = { days };
                ViewTime.parse(periodData);
                periodData.days.sort((a,b) => a.date.getMillis() - b.date.getMillis());
                return periodData;
            },
            _buildMonths = function(periodData) {
                let months = [];

                let days = periodData.days;
                let current = new Date(days[0].date);
                let last = new Date(days.last().date);
                let condition = day => day.date.getFixedMonth() == current.getFixedMonth();

                months.push({days: days.filter(condition)});
                while (current.getFixedMonth() != last.getFixedMonth()) {
                    current.addMonths(1);
                    months.push({days: days.filter(condition)});
                }

                periodData.months = months;

                return periodData;
            },
            _buildWeeks = function(periodData) {
                periodData.months.forEach(month => {
                    let _week = {days: []};
                    let weeks = [];
                    month.days.forEach(day => {
                        if (day.date.getDay() === Settings.INITIAL_WEEKDAY) {
                            if (_week.days.length) {
                                weeks.push(_week);
                                _week = {days: []};
                            }
                        }
                        _week.days.push(day);
                    });
                    weeks.push(_week); // rest
                    month.weeks = weeks;
                    delete month.days;
                });

                return periodData;
            },
            _prepareWeeks = function(periodData) {
                periodData.months.forEach(month => {
                    var monthWorked = 0;
                    month.weeks.forEach(weekData => {
                        DayOff.checkAndMark(weekData);
                        TimeOn.check(weekData);
                        
                        ViewTime.compute(weekData);
                        monthWorked += weekData.worked;
                        
                        ViewTime.toHuman(weekData);
                    });
                    month.worked = Time.millisToHuman(monthWorked);
                });
                
                return periodData;
            },
            _evaluateHeader = function(periodData) {
                let periodHeader = document.querySelector('.qz-box-period');
                periodData.months.forEach((v, index) => {
                    if (index !== 0)
                        periodHeader.appendChild(Snippet.headerMonthLaborTime());
                });

                return periodData;
            },
            _prepareModal = function(periodData) {
                let boxes = document.querySelectorAll('.qz-box-period > .qz-box');
                boxes.forEach((box, index) => {
                    let month = periodData.months[index];
                    let lastDay = month.weeks.last().days.last();
                    if (!!lastDay == false) {
                        month.weeks.forEach(week => {
                            week.days.forEach(day => {
                                lastDay = day;
                            });
                        });
                    }
                    let title = 'Efetuado em ' + lastDay.date.toLocaleDateString('pt-BR', {month: 'long'}).capitalize();

                    let iconRefreshModal = Snippet.buildIconRefreshModal();
                    iconRefreshModal.onclick = () => {
                        _deepCacheCleaning();
                        Queiroz.reload();
                    };
                    box.appendChild(iconRefreshModal);

                    let iconOpenModal = Snippet.buildIconOpenModal();
                    iconOpenModal.onclick = () => {
                        _activate();
                        var openCallback = () => {
                            let modalBody = document.querySelector('.qz-modal .qz-modal-body');
                            modalBody.innerHTML = "";
                            modalBody.appendChild(Snippet.buildReportTable(month));
                        };
                        var closeCallback = () => {
                            _deactivate();
                        };
                        Modal.open(title, openCallback, closeCallback);
                    };
                    box.appendChild(iconOpenModal);
    
                    let help = box.querySelector('.qz-help-text');
                    help.textContent = title;
    
                    let boxContent = box.querySelector('.qz-box-content');
                    boxContent.innerHTML = month.worked;
                    boxContent.classList.remove('fa','fa-spinner','fa-spin');
                });
            },
            _asyncInit = async function() {
                _activate();

                _cache = {};
                if (sessionStorage.hasItem(NAME))
                    _cache = JSON.parse(sessionStorage.getItem(NAME));

                var periodHeader = Snippet.periodHeader();
                periodHeader.appendChild(Snippet.headerMonthLaborTime()); // first
                
                View.appendToPeriodHeader(periodHeader, () => {
                    _getCurrentPeriod()
                        .then(days => _preparePeriod(days))
                        .then(periodData => _buildMonths(periodData))
                        .then(periodData => _buildWeeks(periodData))
                        .then(periodData => _prepareWeeks(periodData))
                        .then(periodData => _evaluateHeader(periodData))
                        .then(periodData => _prepareModal(periodData))
                        .then(() => _deactivate());
                });
            };


        /* Public Functions */

        return {
            init: _asyncInit,
            addObserver: _addObserver
        };
    }();

    /* Module Definition */

    Queiroz.module.report = Report;

})(sessionStorage, window.Queiroz);


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
        Modal     = mod.modal,
        Report    = mod.report,
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
                headersDay[0].style.display = 'none'; // used to "Salvar Marcações"
                var target = headersDay[1];

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
            Modal.init();

            TimeOn.addObserver(KeepAlive);
            MockTime.addObserver(KeepAlive);
            DailyGoal.addObserver(KeepAlive);
            Report.addObserver(KeepAlive);

            Report.init();
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
        View.isLoaded() ? _init() : _initWithDelay();

        window.addEventListener('unload', Notice.closeFiredOnUnload);
        View.appendToFooter(this.description);

        return this.description;
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
