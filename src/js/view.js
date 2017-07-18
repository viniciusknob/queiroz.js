
/*!
 * Queiroz.js: view.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(document, Queiroz) {

    /* Class Definition */

    var View = function() {
        return {
            append: function(selector, html) {
                var _this = this;
                _this.asyncReflow(function() {
                    var
                        element = _this.get(selector),
                        container = document.createElement('div');

                    if (typeof html === 'string') {
                        container.innerHTML = html;
                    } else {
                        container.appendChild(html);
                    }

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

    /* Module Definition */

    Queiroz.module.view = View;

})(document, Queiroz);
