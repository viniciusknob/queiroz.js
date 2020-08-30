
/*!
 * Queiroz.js: timeon.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(storage, Queiroz) {

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
                storage.setItem(NAME, JSON.stringify(cache));
            },
            _remove = function(date) {
                if (_has(date) == false)
                    return;

                delete cache[_buildKey(date)];
                storage.setItem(NAME, JSON.stringify(cache));
            },
            _notifyObservers = function(enable) { // Observer Pattern
                _observers.forEach(function(observer) {
                    observer.notify(TimeOn, { isActive: enable });
                });
            };

        // Initialize cache
        if (storage.hasItem(NAME)) {
            cache = JSON.parse(storage.getItem(NAME));
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
            subscribe: function(observer) { // Observer Pattern
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
