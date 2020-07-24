
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
    Array.prototype.isEmpty = function() {
        return (!!this.length) === false;
    };

    /* Date API */

    // https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/now
    Date.now = function() {
        return new Date();
        //return new Date(2018,8,19,17,00); // => for TEST
    };
    Date.parseKairos = function(string) {
        var
            dateTime = string.split(' '),
            date = dateTime[0].split('_'),
            time = dateTime[1].split(':');
        return new Date(date[2], (date[1] - 1), date[0], time[0], time[1]);
    };
    Date.isLeapYear = function(year) { 
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
    };
    Date.getDaysInMonth = function(year, month) {
        return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    };
    Date.prototype.isLeapYear = function() { 
        return Date.isLeapYear(this.getFullYear()); 
    };
    Date.prototype.getDaysInMonth = function() { 
        return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
    };
    Date.prototype.addMonths = function(value) {
        var n = this.getDate();
        this.setDate(1);
        this.setMonth(this.getMonth() + value);
        this.setDate(Math.min(n, this.getDaysInMonth()));
        return this;
    };
    Date.prototype.isToday = function() {
        var _now = Date.now();
        return this.getDayOfMonth() === _now.getDayOfMonth() &&
               this.getMonth() === _now.getMonth() &&
               this.getFullYear() === _now.getFullYear();
    };
    Date.prototype.getPrevFixedMonth = function() {
        let fixedMonth = this.getFixedMonth();
        return fixedMonth == 1 ? 12 : (fixedMonth - 1);
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
    Date.prototype.toDDmmYYYY = function(separator) {
        let
            day = this.getDayOfMonth().padStart(2),
            month = this.getFixedMonth().padStart(2),
            year = this.getFullYear();
        
        return [day, month, year].join(separator);
    };
    Date.prototype.isCurrentWeek = function(initialWeekDay) {
        // initialWeekDay: 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        let millis = Date.now() - this;
        let days = parseInt(millis / 1000 / 60 / 60 / 24);
        if (days > 7)
            return false;
        
        let currentWeekDay = Date.now().getDay();
        let targetWeekDay = this.getDay();
        
        return (initialWeekDay <= targetWeekDay && targetWeekDay <= currentWeekDay);
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
    String.prototype.capitalize = function() {
        if (this) 
            return this.charAt(0).toUpperCase() + this.slice(1)
        else 
            return this;
    }
    String.is = function(arg) {
        return typeof arg === 'string';
    }

})();
