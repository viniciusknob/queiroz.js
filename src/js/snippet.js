
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

    /* Class Definition */

    var Snippet = function() {

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
            _buildBox = function(opt) {
                var box = _buildTag(TagName.DIV, 'qz-box qz-box-muted qz-text-center');
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', Strings(opt.helpText));
                var humanTime = _buildTag(TagName.STRONG, 'qz-box-content '+opt.contentClass, opt.humanTime);
                box.appendChild(helpText);
                box.appendChild(humanTime);
                if (opt.inlineText) box.className += ' qz-box-inline';
                return box;
            };

        /* Public Functions */

        return {
            style: function() {
                return _buildTag(TagName.STYLE, 'qz-style', Style.CSS);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            buildToggleForDayOff: function(key) {
                return _buildTag(TagName.SPAN,'fa fa-toggle-'+key+' qz-toggle');
            },
            headerBeta: function() {
                var box = _buildBox({
                    helpText: 'config',
                    humanTime: '',
                    contentClass: 'fa fa-flask qz-text-golden',
                    inlineText: true
                });
                box.className += ' qz-box-compact';
                box.onclick = function() {
                    Queiroz.beta();
                }
                return box;
            },
            headerWeeklyGoal: function(weeklyGoal) {
                return _buildBox({
                    helpText: 'goal',
                    humanTime: weeklyGoal,
                    contentClass: 'qz-text-black',
                    inlineText: true
                });
            },
            headerLaborTime: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green',
                    inlineText: true
                });
            },
            headerBalanceTime: function(balanceTime, weekly) {
                return _buildBox({
                    helpText: (weekly ? (balanceTime.contains('+') ? 'extra' : 'pending') : 'balance'),
                    humanTime: balanceTime,
                    contentClass: 'qz-text-' + (weekly ? (balanceTime.contains('+') ? 'green' : 'primary') : 'teal'),
                    inlineText: true
                });
            },
            balanceTimePerDay: function(balanceTime) {
                return _buildBox({
                    helpText: 'balance',
                    humanTime: balanceTime,
                    contentClass: 'qz-text-teal'
                });
            },
            laborTimePerDay: function(laborTime) {
                return _buildBox({
                    helpText: 'labor',
                    humanTime: laborTime,
                    contentClass: 'qz-text-green'
                });
            },
            laborTimePerShift: function(laborTime, finished, number) {
                var box = _buildBox({
                    helpText: (finished ? 'shift' : 'working'),
                    humanTime: laborTime,
                    contentClass: (finished ? '' : 'qz-text-golden')
                });
                if (finished) {
                    var help = box.querySelector('.qz-help-text');
                    var text = help.textContent.replace('_n_', number);
                    help.textContent = text;
                }
                return box;
            },
            todayTimeToLeave: function(timeToLeave, balanced) {
                return _buildBox({
                    helpText: 'exit' + (balanced ? '+' : ''),
                    humanTime: timeToLeave,
                    contentClass: 'qz-text-primary'
                });
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.snippet = Snippet;

})(document, Queiroz);
