$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    GetCategorias();
    GetDepartamentos();
    llenarReporte();


    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function Limpiar() {
        $('#selDepartamento').selectpicker();
        $('#selDepartamento').val(0);
        $('#selDepartamento').selectpicker('refresh');
        $('#selCategoria').selectpicker();
        $('#selCategoria').val(0);
        $('#selCategoria').selectpicker('refresh');

        $('#txtNombre').val('');
        $('#txtPrecio').val('');
        $('#txtCantidad').val('');
    }

    function Procesar(pDatos, controller) {
        //CallLoadingFire();
        $.ajax({
            type: 'POST',
            url: '/PRODCrearProducto/' + controller,
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
                    $('#modalMenu').modal('hide');
                    llenarReporte();
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }
    function Inactivar(id) {
        Swal.fire({
            title: 'ELIMINAR',
            text: '¿Esta seguro que desea inactivar el producto solicitado?',
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
                    url: '/PRODCrearProducto/Eliminar',
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

    function TBL_PRODUCTO(ID_PRODUCTO, ID_CATEGORIA, NOMBRE, PRECIO, CANTIDAD, ID_DEPARTAMENTO) {
        this.ID_PRODUCTO= ID_PRODUCTO;
        this.ID_CATEGORIA = ID_CATEGORIA;
        this.NOMBRE = NOMBRE;
        this.PRECIO = PRECIO;
        this.CANTIDAD = CANTIDAD;
        this.ID_DEPARTAMENTO = ID_DEPARTAMENTO;
    }
    $('#btnGuardar').on('click', function (e) {
        e.preventDefault();

        var idCategoria = $('#selCategoria').val();
        var idDepartamento = $('#selDepartamento').val();
        var idMenu = $('#hfIDMenu').val();
        var nombre = $('#txtNombre').val();
        var precio = $('#txtPrecio').val();
        var cantidad = $('#txtCantidad').val();
        var controlador = $('#hfControlador').val();

        //----------------ENCAPSULAMIENTO ENCABEZADO NC----------------        
        var DATOS = new TBL_PRODUCTO(idMenu, idCategoria, nombre, precio, cantidad, idDepartamento);

        Procesar(DATOS, controlador);

    });

    function GetCategorias() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PRODCrearProducto/GetCategorias',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selCategoria').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selCategoria').append('<option value="' + dato.ID_CATEGORIA + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selCategoria').selectpicker();
                    $('#selCategoria').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }
    function GetDepartamentos() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/PRODCrearProducto/GetDepartamentos',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    var traerDatos = data["DATA"];
                    $('#selDepartamento').empty();
                    traerDatos.forEach(function (dato) {
                        $('#selDepartamento').append('<option value="' + dato.ID_DEPARTAMENTO + '">' + dato.NOMBRE + '</option>');
                    });
                    $('#selDepartamento').selectpicker();
                    $('#selDepartamento').selectpicker('refresh');
                    resolve(1);
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                    reject(ex);
                }
            });
        });
    }

    function llenarReporte() {
        var customStore = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                $.ajax({
                    type: 'GET',
                    url: '/PRODCrearProducto/CargarTablaMenu',
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
                    dataField: "ID_PRODUCTO",
                    caption: "ID ",
                    visible: false
                },
                {
                    dataField: "ID_DEPARTAMENTO",
                    caption: "ID ",
                    visible: false
                },
                {
                    dataField: "ID_CATEGORIA",
                    caption: "ID CATEGORIA",
                    visible: false
                },
                {
                    dataField: "CATEGORIA",
                    caption: "CATEGORIA"
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
                    dataField: "CREADO_POR",
                    caption: "CREADO POR"
                },
                {
                    dataField: "PRECIO",
                    caption: "PRECIO",
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD",
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
                                $('#hfIDMenu').val(e.row.data['ID_PRODUCTO']);

                                $('#selCategoria').selectpicker();
                                $('#selCategoria').val(e.row.data['ID_CATEGORIA']);
                                $('#selCategoria').selectpicker('refresh');
                                $('#selDepartamento').selectpicker();
                                $('#selDepartamento').val(e.row.data['ID_DEPARTAMENTO']);
                                $('#selDepartamento').selectpicker('refresh');

                                $('#txtNombre').val(e.row.data['NOMBRE']);
                                $('#txtPrecio').val(e.row.data['PRECIO']);
                                $('#txtCantidad').val(e.row.data['CANTIDAD']);

                                $('#hfControlador').val('Editar');

                                $('#modalMenu').modal('show');
                            }
                        },
                        {
                            hint: "Anular",
                            icon: "close",
                            onClick: function (e) {
                                Inactivar(e.row.data['ID_PRODUCTO']);
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
                                $('#hfIDMenu').val(0);
                                $('#hfControlador').val('Guardar');
                                $('#modalMenu').modal('show');
                            }
                        }
                    })
            }
        });
    }

});