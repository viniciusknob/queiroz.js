
/*!
 * Queiroz.js: kairos.js
 * JavaScript Extension for Dimep Kairos
 * https://github.com/viniciusknob/queiroz.js
 */

(function(window, Queiroz) {

    /* Class Definition */
    
    var Kairos = function() {


        /* Constants */

        const
            BUSCAR_APONTAMENTOS_URL = '/Dimep/Ponto/BuscarApontamentos',
            BUSCAR_PEDIDOS_APONTAMENTO_URL = '/Dimep/PedidosJustificativas/BuscarPedidosApontamento';
        

        /* Private Functions */

        var
            _getURL = function() {
                let path = window.location.pathname;
                return /Ponto/.test(path) ? 
                    BUSCAR_APONTAMENTOS_URL : BUSCAR_PEDIDOS_APONTAMENTO_URL;
            };


        /* Public Functions */

        return {
            reload: function() {
                window.location.reload(true);
            },
            loadAppointments: function(code = 0) {
                window.dtoPessoaApontamentos.Week = code; // TODO create my own?
                return fetch(_getURL(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify(window.dtoPessoaApontamentos)
                })
                .then(response => response.text())
                .then(plainText => new DOMParser().parseFromString(plainText, 'text/html'));
            }
        };
    }();

    /* Module Definition */

    Queiroz.module.kairos = Kairos;

})(window, window.Queiroz);
