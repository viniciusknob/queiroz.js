
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
