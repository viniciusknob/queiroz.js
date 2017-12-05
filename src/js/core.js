
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
        _buildDayOptions = function() {
            _buildDayOffOption();
            View.getAllColumnDay().forEach(function(eDay) {
                var headersDay = View.getHeadersDay(eDay);
                var target = headersDay[0];
                headersDay[1].style.display = 'none';

                var options = {weekday:'short', day: '2-digit', month: '2-digit'};
                var day = Date.parseKairos(View.getDateFromTargetAsString(eDay) + " " + Time.zero);
                var dateString = day.toLocaleDateString('pt-BR', options);
                target.innerHTML = dateString;

                if (DayOff.is(day) == false) {
                    target.insertBefore(Snippet.buildDayOptions(TimeOn), target.firstChild);
                    target.querySelector('.qz-dropdown').onmouseover = function() {
                        var menu = target.querySelector('.qz-dropdown-content');
                        menu.style.minWidth = target.offsetWidth + 'px';
                    };
                }
            });
        },
        _init = function() {
            View.appendToHead(Snippet.style());
            var data = View.read();
            Time.parse(data);
            View.removeUnusedDays(data);
            DayOff.check(data);
            TimeOn.check(data);
            _buildDayOptions();
            Time.compute(data);
            Notice.check(data);
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

        // reset
        DayOff.count = 0;

        Queiroz.bless();
    };

})(Queiroz);
