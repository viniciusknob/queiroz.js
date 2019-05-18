
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
                        found = false;
                        timeArr = _get(date);

                    timeArr.forEach(function(time) {
                        if (mockTime == time)
                            found = true;
                    });

                    return found;
                } else {
                    return !!cachedDate;
                }
                return false;
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

})(localStorage, Queiroz);
