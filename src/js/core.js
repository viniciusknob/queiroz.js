
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
            var eToggle = Snippet.buildToggleForDayOff(DayOff.is(day) ? 'off' : 'on');
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
        _buildDayOffOption = function(data) {
            var active = false;
            View.getAllColumnDay().forEach(function(eDay) {
                var day = Date.parseKairos(View.getDateFromTargetAsString(eDay) + " " + Time.zero);

                if (day.getDay() === Settings.INITIAL_WEEKDAY)
                    active = true;

                if (active && Settings.isWorkDay(day)) {
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

    Queiroz.reload = function() {
        View.getAllQueirozElements().forEach(function(element) {
            element.remove();
        });

        _init();
    };

})(window, Queiroz);
