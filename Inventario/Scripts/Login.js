$(document).ready(function () {
    ValidarSesion();

    /**
     * Método que evalua parametros de url para validar mensaje de sesión expirada     
     */
    function ValidarSesion() {
        var url = window.location.href;
        var params = getURLParams(url);
        if (params["expirado"] != null) {
            if (params["expirado"].toLowerCase() == "true") {
                showNotification('top', 'right', "error", 'Primero debe iniciar sesion o bien la sesion ha expirado', 'danger');
            }
        }
    }

    $('#txtUser').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#btnLogin').click();
        }
    });

    $('#txtPassword').keyup(function (e) {
        if (e.keyCode == 13) {
            $('#btnLogin').click();
        }
    });

    $('#btnLogin').on('click', function (e) {
        e.preventDefault();
        
        if ($('#frmLogin').valid()) {
            $.ajax({
                type: 'POST',
                url: '/Home/IniciarSesion',
                data: { usuario: $('#txtUser').val(), password: $('#txtPassword').val() },
                success: function (data) {
                    var estado = data["Estado"];
                    if (estado == 1) {
                        window.location.href = data["URL"];
                    }
                    if (estado == -1) {
                        showNotification('top', 'right', "error", 'Credenciales inválidas', 'danger');
                    }
                    if (estado == -2) {
                        window.location.href = data["URL"];
                    }
                    if (estado == -3) {
                        showNotification('top', 'right', "error", data["Mensaje"], 'danger');
                    }
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                }
            });
        }
    });
});