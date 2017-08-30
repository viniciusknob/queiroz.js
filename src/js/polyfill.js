
/*!
 * Queiroz.js: polyfill.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function() {

    Array.prototype.last = function() {
        return this[this.length-1];
    };
    Array.prototype.contains = function(value) {
        return this.indexOf(value) > -1;
    };
    Storage.prototype.hasItem = function(name) {
        return (this.getItem(name) || false);
    };
    Number.prototype.format = function(length) {
        var _number = ''+this;
        while(_number.length < length)
            _number = '0'+_number;
        return _number;
    };
    Date.prototype.getDateAsKairos = function() {
        return this.getDate().format(2) + "_" + (this.getMonth()+1).format(2) + "_" + this.getFullYear();
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
    };
    String.prototype.contains = function(str) {
        return this.indexOf(str) > -1;
    };

})();
