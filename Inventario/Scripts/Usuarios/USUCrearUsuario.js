$(document).ready(function () {
    fillAllInputsForms();
    function fillAllInputsForms() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function LimpiarDatosUser() {
        $("#txtPdvUser").val('');
        $("#hfPuntoVenta").val('');
        $("#txtUser").val('');
        $("#txtPassword").val('');
        $("#txtNombreUser").val('');
        $("#txtApellidoUser").val('');
        $("#selPlantaUser").val('');
        $("#selEmpleadoUser").val('');
    }
    function GetEmpleados() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/USUCrearUsuario/GetEmpleados',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    debugger;
                    var traerDatos = data["DATA"];
                    $('#selEmpleadoUser').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selEmpleadoUser').append('<option value="' + dato.ID_EMPLEADO + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selEmpleadoUser').selectpicker();
                    $('#selEmpleadoUser').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetModulos() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/USUCrearUsuario/GetModulos',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    debugger;
                    var traerDatos = data["DATA"];
                    $('#selModuloUser').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selModuloUser').append('<option value="' + dato.ID_MODULO + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selModuloUser').selectpicker();
                    $('#selModuloUser').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetDatos(usuario) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/USUCrearUsuario/GetDatos',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: { pUser: usuario },
                cache: false,
                success: function (data) {
                    var state = data["Estado"];
                    if (state == 1) {
                        var datos = data["DatoGeneral"];
                        $('#spnUsuario').html(datos.USUARIO);
                        $('#spnPassword').html(datos.CONTRASEÑA);                        
                        $('#h3NombreCompleto').html(datos.NOMBRE);
                        $('#spnEstadoUsuario').html(datos.ESTADO);


                        if (datos.ESTADO == 'ACTIVO') {
                            $('#spnEstadoUsuario').removeClass('btn-danger');
                            $('#spnEstadoUsuario').addClass('btn-primary');
                        } else {
                            $('#spnEstadoUsuario').removeClass('btn-primary');
                            $('#spnEstadoUsuario').addClass('btn-danger');
                        }

                        showNotification('top', 'right', 'done', 'Búsqueda Exitosa!!', 'success');
                    }
                    if (data["Estado"] == -1) {
                        showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                        return;
                    }
                    if (data["Estado"] == -2) {
                        showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                        return;
                    }
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }

    $("#txtUsuarioBusqueda").keypress(function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            var vUser = $('#txtUsuarioBusqueda').val();
            GetDatos(vUser);
        }
    });

    $('#btnCrearUsuario').on('click', function (e) {
        e.preventDefault();
        LimpiarDatosUser();
        $('#selEmpleadoUser').empty();
        $('#selEmpleadoUser').selectpicker('refresh');
        $('#modalCrearUsuario').modal('show');
        GetModulos();
        GetEmpleados();
    });

    function USUARIO(ID_EMPLEADO, USUARIO, CONTRASEÑA, ID_MODULO) {
        this.ID_EMPLEADO = ID_EMPLEADO;
        this.USUARIO = USUARIO;
        this.CONTRASEÑA = CONTRASEÑA;
        this.ID_MODULO = ID_MODULO;
    }
    function GUARDAR_USUARIO(pDatos) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/USUCrearUsuario/CrearUsuario',
            data: {
                datos: JSON.stringify(pDatos)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'center', 'success', 'Usuario creado exitosamente.', 'success');
                    $('#modalCrearUsuario').modal('hide');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    $('#btnGuardarUsr').on('click', function (e) {
        e.preventDefault();

        //----------------VALIDACION DE FORMULARIO----------------
        if ($('#formCreacionUsers').valid()) {
            var idempleado = $('#selEmpleadoUser').val();
            var usuario = $('#txtUser').val();
            var contra = $('#txtPassword').val();
            var idmodulo = $('#selModuloUser').val();
            var datos = new USUARIO(idempleado, usuario, contra, idmodulo);

            GUARDAR_USUARIO(datos);
        }
    });

    $('#btnVerContraseña').on('click', function (e) {
        e.preventDefault();
    });

    $('#btnCambioContrasena').on('click', function (e) {
        e.preventDefault();
        $('#modalCambiarContraseña').modal('show');
    });

    function CAMBIAR_CONTRASEÑA(usuario, contra) {
        CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/USUCrearUsuario/CambiarContraseña',
            data: {
                usuario, contra
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'center', 'success', 'Se ha cambiado la contraseña.', 'success');
                    $('#modalCambiarContraseña').modal('hide');
                    GetDatos(usuario);
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    $('#btnCambiarContra').on('click', function (e) {
        e.preventDefault();

        //----------------VALIDACION DE FORMULARIO----------------
        if ($('#formCambiarContra').valid()) {
            var usuario = $('#txtUsuarioBusqueda').val();
            var contra = $('#txtNewPassword').val();
            CAMBIAR_CONTRASEÑA(usuario, contra);
        }
    });

    $('#spnEstadoUsuario').on('click', function (e) {
        e.preventDefault();
    });

});