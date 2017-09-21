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

        /* Public Functions */

        return {
            init: function() {
                if (_timeOut)
                    clearTimeout(_timeOut);

                if (Settings.KEEP_ALIVE)
                    _timeOut = setTimeout(Queiroz.reload, Settings.KEEP_ALIVE);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.keepalive = KeepAlive;

})(setTimeout, clearTimeout, Queiroz);
