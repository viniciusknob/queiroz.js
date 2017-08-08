
/*!
 * Queiroz.js: util.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Polyfill */

    Array.prototype.last = function() {
        return this[this.length-1];
    };
    Number.prototype.format = function(length) {
        var _number = ''+this;
        while(_number.length < length)
            _number = '0'+_number;
        return _number;
    };
    Date.prototype.getTimeAsString = function() {
        return this.getHours().format(2) + ':' + this.getMinutes().format(2);
    };
    Date.prototype.getDayOfMonth = function() {
        return this.getDate();
    };
    Date.prototype.getMillis = function() {
        return this.getTime();
    };
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }

    /* Class Definition */

    var Util = function() {
        return {
            textFormat: function(pattern, args) {
                for (var index = 0; index < args.length; index++) {
                    var regex = new RegExp('\\{' + index + '\\}', 'g');
                    pattern = pattern.replace(regex, args[index]);
                }
                return pattern;
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.util = Util;

})(Queiroz);
