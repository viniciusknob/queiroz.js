
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
