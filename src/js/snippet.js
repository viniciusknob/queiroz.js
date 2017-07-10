
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Plugins */

    var
      Strings = Queiroz.pl.strings,
      Style = Queiroz.pl.style;

    /* Constants */

    var
        TagName = {
            DIV: 'div',
            P: 'p',
            SPAN: 'span',
            STYLE: 'style',
            STRONG: 'strong'
        };


    /* Class Definition */

    var Snippet = function() {

        var
            _buildTag = function(name, clazz, text) {
                var element = document.createElement(name);
                if (clazz) {
                    element.className = clazz;
                }
                if (text) {
                    var textNode = document.createTextNode(text);
                    element.appendChild(textNode);
                }
                return element;
            },
            _buildBoxHeader = function(boxContent, strongValue, strongClass) {
                var box = _buildTag(TagName.SPAN, 'qz-box qz-box-muted', boxContent);
                var time = _buildTag(TagName.STRONG, strongClass, strongValue);
                box.appendChild(time);
                return box;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, '', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLastWeekModeOn: function() {
                return _buildBoxHeader('', Strings('hLastWeek'), 'qz-text-primary');
            },
            headerLaborTime: function(laborTime) {
                return _buildBoxHeader(Strings('hLabor'), laborTime, 'qz-text-green');
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBoxHeader(Strings('hBalance'), balanceTime, 'qz-text-teal');
            },
            headerWeekPendingTime: function(pendingTime) {
                return _buildBoxHeader(Strings('hPending'), pendingTime, 'qz-text-primary');
            },
            headerExtraTime: function(extraTime) {
                return _buildBoxHeader(Strings('hExtra'), extraTime, 'qz-text-green');
            },
            headerWeekTimeToLeave: function(timeToLeave) {
                return _buildBoxHeader(Strings('hExit'), timeToLeave, 'qz-text-primary');
            },
            balanceTimePerDay: function(balanceTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('balance'));
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-teal', balanceTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerDay: function(laborTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('labor'));
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-green', laborTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerShift: function(laborTime, finished) {
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                var time = _buildTag(TagName.STRONG, 'qz-box-content', laborTime);
                if (!finished) {
                    var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('working'));
                    div.appendChild(helpText);
                    time.classList.add('qz-text-golden');
                }
                div.appendChild(time);
                return div;
            },
            todayTimeToLeave: function(timeToLeave) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings('exit'));
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-primary', timeToLeave);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            }
        };
    }();

    /* Plugin Definition */

    Queiroz.pl.snippet = Snippet;

})(Queiroz);
