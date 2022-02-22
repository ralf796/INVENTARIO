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
        $('#txtNombre').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/DEPCrearDepartamento/' + controller,
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
                    $('#modalTipoMenu').modal('hide');

                }
                llenarReporte();
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    function TBL_DEPARTMENTO(ID_DEPARTAMENTO, NOMBRE) {
        this.ID_DEPARTAMENTO= ID_DEPARTAMENTO;
        this.NOMBRE = NOMBRE;
    }

    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var idTipoMenu = $('#hfIDTIPOMENU').val();
        var nombre = $('#txtNombre').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new TBL_DEPARTMENTO(idTipoMenu, nombre);

        Procesar(DATOS, controlador);

    });

    function Inactivar(id) {
        Swal.fire({
            title: 'ELIMINAR',
            text: '¿Esta seguro que desea inactivar al departamento solicitado?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                CallLoadingFire();
                $.ajax({
                    type: 'POST',
                    url: '/DEPCrearDepartamento/Eliminar',
                    data: {
                        id: id
                    },
                    success: function (data) {
                        if (data["Estado"] == -1) {
                            showNotification('top', 'right', 'error', data["MENSAJE"], 'danger');
                            return;
                        }
                        if (data["Estado"] == 1) {
                            showNotification('top', 'right', 'success', 'Proceso realizado con éxito', 'success');
                            llenarReporte();
                        }
                    },
                    error: function (jqXHR, ex) {
                        getErrorMessage(jqXHR, ex);
                    }
                });
            }
        })
    }

    function llenarReporte() {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/DEPCrearDepartamento/CargarTablaTipoMenu',
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
                    dataField: "ID_DEPARTAMENTO",
                    caption: "ID",
                    visible: false
                },

                {
                    dataField: "NOMBRE",
                    caption: "NOMBRE"
                },

                {
                    dataField: "CREADO_POR",
                    caption: "CREADO POR"
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
                },
                {
                    type: "buttons",
                    width: 100,
                    alignment: "center",
                    buttons: [
                        {
                            hint: "Actualizar",
                            icon: "edit",
                            onClick: function (e) {
                                $('#hfIDTIPOMENU').val(e.row.data['ID_DEPARTAMENTO']);

                                $('#txtNombre').val(e.row.data['NOMBRE']);
                                $('#txtCreadoPor').val(e.row.data['CREADO_POR']);
                                $('#txtFechaCreacion').val(e.row.data['FECHA_CREACION']);

                                $('#hfControlador').val('Editar');

                                $('#modalTipoMenu').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_DEPARTAMENTO']);
                            }
                        }
                    ]
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
                                $('#hfIDTIPOMENU').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalTipoMenu').modal('show');
                            }
                        }
                    })
            }
        });
    }



});