
/*!
 * Queiroz.js: polyfill.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function() {

    /* Array API */

    Array.prototype.last = function() {
        return this[this.length-1];
    };
    Array.prototype.contains = function(value) {
        return this.indexOf(value) > -1;
    };

    /* Date API */

    Date.now = function() {
        return new Date();
        //return new Date(2018,0,26,13,00); // => for TEST
    };
    Date.parseKairos = function(string) {
        var
            dateTime = string.split(' '),
            date = dateTime[0].split('_'),
            time = dateTime[1].split(':');
        return new Date(date[2], (date[1] - 1), date[0], time[0], time[1]);
    };
    Date.prototype.isToday = function() {
        var _now = Date.now();
        return this.getDayOfMonth() === _now.getDayOfMonth() &&
               this.getMonth() === _now.getMonth() &&
               this.getFullYear() === _now.getFullYear();
    };
    Date.prototype.getFixedMonth = function() {
        return this.getMonth() + 1;
    };
    Date.prototype.getDateAsKairos = function() {
        return this.getDate().padStart(2) + "_" + this.getFixedMonth().padStart(2) + "_" + this.getFullYear();
    };
    Date.prototype.getTimeAsString = function() {
        return this.getHours().padStart(2) + ':' + this.getMinutes().padStart(2);
    };
    Date.prototype.getDayOfMonth = function() {
        return this.getDate();
    };
    Date.prototype.getMillis = function() {
        return this.getTime();
    };

    /* Others */

    Storage.prototype.hasItem = function(name) {
        return !!this.getItem(name);
    };
    Number.prototype.padStart = function(length) {
        var _number = ''+this;
        while(_number.length < length)
            _number = '0'+_number;
        return _number;
    };
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };
    Element.prototype.data = function(name, value) {
        if (value)
            return this.setAttribute(name, value);
        else
            return this.getAttribute(name)
    };
    String.prototype.contains = function(str) {
        return this.indexOf(str) > -1;
    };

})();
