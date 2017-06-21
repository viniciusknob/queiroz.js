
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
        };


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
            STYLE: '<style>%css%</style>',
            header: function() {
                return _buildTag(TagName.P, 'qz-box-head');
            },
            headerLastWeekModeOn: function() {
                return _buildBoxHeader('', 'SEMANA ANTERIOR');
            },
            headerLaborTime: function(laborTime) {
                return _buildBoxHeader('Total: ', laborTime);
            },
            headerWeekMissingTime: function(missingTime) {
                return _buildBoxHeader('Faltam: ', missingTime);
            },
            headerExtraTime: function(extraTime) {
                return _buildBoxHeader('Extra: ', extraTime);
            },
            headerWeekTimeToLeave: function(timeToLeave) {
                return _buildBoxHeader('Saída: ', timeToLeave);
            },
            laborTimePerDay: function(laborTime) {
                var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Efetuado');
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
                    var helpText = _buildTag(TagName.DIV, 'qz-help-text', 'Trabalhando...');
                    div.appendChild(helpText);
                    time.classList.add('qz-text-secondary');
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

    window[NAME] = Snippet;

})(window);