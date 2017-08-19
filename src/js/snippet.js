
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Modules */

    var
      Strings = Queiroz.module.strings,
      Style = Queiroz.module.style;

    /* Constants */

    var
        TagName = {
            DIV: 'div',
            P: 'p',
            SPAN: 'span',
            STYLE: 'style',
            STRONG: 'strong',
            BUTTON: 'button',
            SMALL: 'small',
            TABLE: 'table',
            THEAD: 'thead',
            TBODY: 'tbody',
            TH: 'th',
            TR: 'tr',
            TD: 'td'
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
            _buildBox = function(helpText, strongValue, strongClass) {
                var eBox = _buildTag(TagName.DIV, 'qz-box qz-box-inline qz-box-muted qz-text-center');
                if (helpText) {
                    var eHelpText = _buildTag(TagName.DIV, 'qz-help-text', helpText);
                    eBox.appendChild(eHelpText);
                }
                var eTime = _buildTag(TagName.STRONG, 'qz-box-content '+strongClass, strongValue);
                eBox.appendChild(eTime);
                return eBox;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, '', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLaborTime: function(laborTime) {
                return _buildBox(Strings('labor'), laborTime, 'qz-text-green');
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBox(Strings('balance'), balanceTime, 'qz-text-teal');
            },
            headerWeekPendingTime: function(pendingTime) {
                return _buildBox(Strings('pending'), pendingTime, 'qz-text-primary');
            },
            headerExtraTime: function(extraTime) {
                return _buildBox(Strings('extra'), extraTime, 'qz-text-green');
            },
            headerBeta: function() {
                var box = _buildBox('New', '', 'fa fa-flask qz-text-golden');
                box.className += ' qz-box-compact';
                box.onclick = function() {
                    Queiroz.beta();
                }
                return box;
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
            todayTimeToLeave: function(timeToLeave, balanced) {
                var helpText = balanced ? Strings('exit+') : Strings('exit');
                var content = _buildTag(TagName.DIV, 'qz-help-text', helpText);
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-primary', timeToLeave);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(content);
                div.appendChild(time);
                return div;
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, Queiroz);
