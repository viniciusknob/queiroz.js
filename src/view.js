
/*!
 * Queiroz.js 2.6.9: view.js
 * JavaScript Extension for Dimep Kairos
 */

(function(window) {

    /* Constants */

    var NAME = 'view';


    /* Module Definition */

    var View = function() {

        /* PUBLIC */

        return {
            append: function(selector, html) {
                var _this = this;
                _this.asyncReflow(function() {
                    var
                        element = _this.get(selector),
                        container = document.createElement('div');

                    container.innerHTML = html;
                    element.appendChild(container);
                });
            },
            asyncReflow: function(task) {
                setTimeout(task, 25);
            },
            get: function(selector, target) {
                return (target || document).querySelector(selector);
            },
            getAll: function(selector, target) {
                return (target || document).querySelectorAll(selector);
            }
        };
    }();

    window[NAME] = View;

})(window);