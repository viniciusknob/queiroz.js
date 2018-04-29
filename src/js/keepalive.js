/*!
 * Queiroz.js: keepalive.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(setTimeout, clearTimeout, setInterval, clearInterval, Queiroz) {

    /* Modules */

    var
        mod      = Queiroz.module,
        Settings = mod.settings,
        Kairos   = mod.kairos;

    /* Class Definition */

    var KeepAlive = function() {

        var
            _qzTimeOut = false,
            _ksTimeOut = false;

        /* Private Functions */

        var
            _clear = function() {
                if (_qzTimeOut)
                    clearInterval(_qzTimeOut);

                if (_ksTimeOut)
                    clearTimeout(_ksTimeOut);

                _qzTimeOut = false;
                _ksTimeOut = false;
            },
            _init = function() {
                if (_qzTimeOut && _ksTimeOut)
                    return;

                _clear();

                if (Settings.QZ_KEEPALIVE)
                    _qzTimeOut = setInterval(Queiroz.reload, Settings.QZ_KEEPALIVE);

                if (Settings.KS_KEEPALIVE)
                    _ksTimeOut = setTimeout(Kairos.reload, Settings.KS_KEEPALIVE);
            };

        /* Private Functions */

        return {
            init: _init,
            update: function(observable, args) { // Observer Pattern
                if (args.isActive)
                    _clear();
                else
                    _init();
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.keepalive = KeepAlive;

})(setTimeout, clearTimeout, setInterval, clearInterval, Queiroz);
