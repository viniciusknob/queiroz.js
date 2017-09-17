
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
