
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

})(localStorage, Queiroz);
