
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(Queiroz) {

    /* Constants */

    var
        Style = '__css__',
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
                return _buildTag(TagName.STYLE, '', Style);
            },
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLastWeekModeOn: function() {
                return _buildBoxHeader('', 'SEMANA ANTERIOR', 'qz-text-primary');
            },
            headerLaborTime: function(laborTime) {
                return _buildBoxHeader('Efetuado: ', laborTime, 'qz-text-green');
            },
            headerBalanceTime: function(balanceTime) {
                return _buildBoxHeader('Saldo: ', balanceTime, 'qz-text-teal');
            },
            headerWeekPendingTime: function(pendingTime) {
                return _buildBoxHeader('Pendente: ', pendingTime, 'qz-text-primary');
            },
            headerExtraTime: function(extraTime) {
                return _buildBoxHeader('Extra: ', extraTime, 'qz-text-green');
            },
            headerWeekTimeToLeave: function(timeToLeave) {
                return _buildBoxHeader('Saída: ', timeToLeave, 'qz-text-primary');
            },
            balanceTimePerDay: function(balanceTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Saldo');
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-teal', balanceTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerDay: function(laborTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Efetuado');
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
                    var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Trabalhando...');
                    div.appendChild(helpText);
                    time.classList.add('qz-text-golden');
                }
                div.appendChild(time);
                return div;
            },
            todayTimeToLeave: function(timeToLeave) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Saída');
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
