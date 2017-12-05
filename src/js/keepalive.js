/*!
 * Queiroz.js: keepalive.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(setTimeout, clearTimeout, Queiroz) {

    /* Modules */

    var Settings = Queiroz.settings;

    /* Class Definition */

    var KeepAlive = function() {

        var _timeOut;

        /* Private Functions */

        var
            _init = function(enable) {
                if (_timeOut)
                    clearTimeout(_timeOut);

                if (enable && Settings.KEEP_ALIVE)
                    _timeOut = setTimeout(Queiroz.reload, Settings.KEEP_ALIVE);
            };

        /* Public Functions */

        return {
            init: function() {
                _init(true);
            },
            update: function(observable, args) { // Observer Pattern
                _init(!args.state);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.keepalive = KeepAlive;

})(setTimeout, clearTimeout, Queiroz);
