
/*!
 * Queiroz.js: snippet.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window) {

    /* Constants */

    var
        NAME = 'snippet',

        TagName = {
            DIV: 'div',
            P: 'p',
            SPAN: 'span',
            STRONG: 'strong'
        },

        STYLE = ''+
            '<style>' +
                // reset
                'strong{font-weight:bold;}' +
                // override
                '.ContentTable {margin-top:inherit;}' +
                '.emptySlot,.FilledSlot,.LastSlot {height:inherit;padding:5px;}' +
                '.FilledSlot span {margin:inherit!important;}' +
                // queiroz.js classes
                '.qz-text-primary {color:brown;}' +
                '.qz-box {padding:5px 10px;margin:5px 1px;border:darkgrey 1px solid;}' +
                '.qz-box-head {float:right;padding:10px 0;}' +
                '.qz-box-muted {background-color:lightgray;}' +
                '.qz-box .qz-box-content {vertical-align:middle;}' +
                '.help-text {font-size:10px;}' +
            '</style>';


    /* Module Definition */

    var Snippet = function() {

        /* PRIVATE */

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
            _buildBoxHeader = function(boxContent, strongValue) {
                var box = _buildTag(TagName.SPAN, 'qz-box qz-box-muted', boxContent);
                var time = _buildTag(TagName.STRONG, 'qz-text-primary', strongValue);
                box.appendChild(time);
                return box;
            };

        /* PUBLIC */

        return {
            STYLE: STYLE,
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLastWeekModeOn: function() {
                return _buildBoxHeader('', 'SEMANA ANTERIOR');
            },
            headerLaborTime: function(laborTime) {
                return _buildBoxHeader('Total: ', laborTime);
            },
            headerTodayMissingTime: function(missingTime) {
                return _buildBoxHeader('Faltam/Hoje: ', missingTime);
            },
            headerWeekMissingTime: function(missingTime) {
                return _buildBoxHeader('Faltam/Semana: ', missingTime);
            },
            headerExtraTime: function(extraTime) {
                return _buildBoxHeader('Extra: ', extraTime);
            },
            headerTimeToLeave: function(timeToLeave) {
                return _buildBoxHeader('Saída/Fim: ', timeToLeave);
            },
            laborTimePerDay: function(laborTime) {
                var helpText = _buildTag(TagName.DIV, 'help-text', 'Efetuado');
                var time = _buildTag(TagName.STRONG, 'qz-box-content qz-text-primary', laborTime);
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                div.appendChild(helpText);
                div.appendChild(time);
                return div;
            },
            laborTimePerShift: function(laborTime, finished) {
                var div = _buildTag(TagName.DIV, 'qz-box qz-box-muted');
                var time = _buildTag(TagName.STRONG, 'qz-box-content', laborTime);
                if (!finished) {
                    var helpText = _buildTag(TagName.DIV, 'help-text', 'Trabalhando...');
                    div.appendChild(helpText);
                    time.style.color = 'darkgoldenrod';
                }
                div.appendChild(time);
                return div;
            }
        };
    }();

    window[NAME] = Snippet;

})(window);