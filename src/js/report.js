
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
