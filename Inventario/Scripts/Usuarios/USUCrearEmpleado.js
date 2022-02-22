$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    llenarReporte();

    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function Limpiar() {
        $('#selTipoEmpleado').selectpicker();
        $('#selTipoEmpleado').val(0);
        $('#selTipoEmpleado').selectpicker('refresh');

        $('#txtNombre').val('');
        $('#txtSalario').val('');
        $('#txtTelefono').val('');
        $('#txtCorreo').val('');
        $('#txtDireccion').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/USUCrearEmpleado/' + controller,
            data: {
                datos: JSON.stringify(pDatos)
            },
            success: function (data) {
                if (data["Estado"] == -1) {
                    showNotification('top', 'right', 'error', data["Mensaje"], 'danger');
                    return;
                }
                else if (data["Estado"] == 1) {
                    showNotification('top', 'right', 'success', 'Proceso realizado con éxito', 'success');
                    $('#modalEmpleado').modal('hide');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function EMPLEADO(NOMBRE) {
        this.NOMBRE = NOMBRE;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();
        var nombre = $('#txtNombre').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new EMPLEADO(nombre);
        Procesar(DATOS, controlador);
    });

    function llenarReporte() { //ESTO ES PARA EL PULL
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/USUCrearEmpleado/CargarTablaEmpleado',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: {},
                    cache: false,
                    success: function (data) {
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);
                    },
                    error: function (jqXHR, exception) {
                    }
                });
                return d.promise();
            },
            byKey: function (key, extra) {
            },
            update: function (key, values) {
            }
        });
        var salesPivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(customStore),
            columnAutoWidth: true,
            wordWrapEnabled: true,
            showBorders: true,
            rowAlternationEnabled: true,
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 20, 50, 100],
                showNavigationButtons: true,
                showInfo: true,
                infoText: "Pagina {0} de {1} ({2} items)"
            },
            columns: [
                {
                    dataField: "ID_EMPLEADO",
                    caption: "ID EMPLEADO",
                    visible: false
                },
                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE"
                },
                {
                    dataField: "FECHA_CREACION",
                    caption: "FECHA CREACION"
                },
                {
                    dataField: "ESTADO",
                    caption: "ESTADO",
                    cellTemplate: function (container, options) {
                        var fieldData = options.data;

                        container.addClass(fieldData.ESTADO != 'A' ? "dec" : "");

                        if (fieldData.ESTADO == 'A')
                            $("<span>").addClass("current-value").text('ACTIVO').appendTo(container);
                        else
                            $("<span>").addClass("current-value").text('INACTIVO').appendTo(container);

                    }
                }
            ],
            onToolbarPreparing: function (e) {
                var dataGrid = e.component;
                e.toolbarOptions.items.unshift(
                    {
                        location: "after",
                        widget: "dxButton",
                        options: {
                            icon: "add",
                            text: "",
                            onClick: function (e) {
                                Limpiar();
                                $('#hfControlador').val('Guardar');
                                $('#modalEmpleado').modal('show');
                            }
                        }
                    })
            }
        });
    }

});