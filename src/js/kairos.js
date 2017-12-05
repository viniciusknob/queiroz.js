
/*!
 * Queiroz.js: kairos.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Class Definition */

    var Kairos = function() {
        return {
            reload: function() {
                window.location.reload(true);
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.kairos = Kairos;

})(window, Queiroz);
