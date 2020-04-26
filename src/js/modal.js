/*!
 * Queiroz.js: modal.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Modules */

    var
        mod = Queiroz.module,
        View = mod.view;

    /* Class Definition */

    var Modal = function() {

        var 
            MODAL = '__modal__';


        /* Private Functions */

        var
            _getModal = function() {
                return document.querySelector('.qz-modal');
            },
            _setModalTitle = function(title) {
                document.querySelector('.qz-modal .qz-modal-title').textContent = title;
            },
            _getCloseButton = function() {
                return document.querySelector(".qz-modal-close");
            },
            _close = function(callback) {
                let modal = _getModal();
                modal.classList.remove('js-show');
                modal.classList.add('js-hide');
                if (callback) 
                    callback();
            },
            _open = function(modalTitle, callback, closeCallback) {
                let modal = _getModal();

                modal.classList.remove('js-hide');
                modal.classList.add('js-show');

                if (modalTitle)
                    _setModalTitle(modalTitle);
                if (closeCallback)
                    _getCloseButton().onclick = () => _close(closeCallback);
                if (callback) 
                    callback();
            },
            _asyncInit = async function() {
                View.appendToBody(MODAL, function() {
                    _getCloseButton().onclick = _close;
                });
            };


        /* Public Functions */

        return {
            init: _asyncInit,
            open: _open
        };
    }();

    /* Module Definition */

    Queiroz.module.modal = Modal;

})(window, window.Queiroz);
