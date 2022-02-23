$(document).ready(function () {

    DevExpress.localization.locale(navigator.language);
    fillAllInputs();
    GetCategorias();
    function ShowShortMessage(type, title, text) {
        Swal.fire({
            position: 'inherit',
            type: type,
            title: title,
            text: text,
            showConfirmButton: false,
            timer: 5000
        })
    }
    function fillAllInputs() {
        $(".formValida .bmd-form-group").each(function () {
            $(this).addClass("is-filled");
        });
    }
    function GetCategorias() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: '/REPProductos/GetCategorias',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: {},
                cache: false,
                success: function (data) {
                    debugger;
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
    function GenerarReporte(categoria) {
        var datasourcereporte = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                var d = $.Deferred();
                CallLoadingFire();
                $.ajax({
                    type: 'GET',
                    url: '/REPProductos/GenerarReporte',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    data: { categoria },
                    cache: false,
                    success: function (data) {
                        data = JSON && JSON.parse(JSON.stringify(data)) || $.parseJSON(data);
                        d.resolve(data);
                        if (data["Estado"] == -1)
                            ShowShortMessage('warning', '¡Advertencia!', data['Mensaje']);
                    },
                    error: function (jqXHR, ex) {
                        getErrorMessage(jqXHR, ex);
                    }
                });
                return d.promise();
            }
        });

        //GRIDCONTAINER
        var PivotGrid = $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.DataSource(datasourcereporte),
            showBorders: true,
            allowColumnReordering: false,
            allowColumnResizing: false,
            columnAutoWidth: false,
            loadPanel: {
                text: "Cargando..."
            },
            scrolling: {
                useNative: false,
                scrollByContent: true,
                scrollByThumb: true,
                showScrollbar: "always" // or "onScroll" | "always" | "never"
            },
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: "Buscar..."
            },
            headerFilter: {
                visible: true
            },
            columnAutoWidth: true,
            filterRow: {
                visible: true,
                applyFilter: "auto"
            },
            groupPanel: {
                visible: false,
            },
            grouping: {
                autoExpandAll: true,
            },
            paging: {
                pageSize: 10
            },
            columns: [
                {
                    dataField: "CATEGORIA",
                    caption: "CATEGORIA"
                },
                {
                    dataField: "DEPARTAMENTO",
                    caption: "DEPARTAMENTO"
                },
                {
                    dataField: "ARTICULO",
                    caption: "ARTICULO"
                },
                {
                    dataField: "PRECIO",
                    caption: "PRECIO"
                },
                {
                    dataField: "CANTIDAD",
                    caption: "CANTIDAD"
                },
                {
                    dataField: "FECHA_CREACION",
                    caption: "FECHA"
                },
                {
                    dataField: "CREADO_POR",
                    caption: "USUARIO"
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
            export: {
                enabled: true,
                fileName: 'REPORTE DE ARTICULOS POR CATEGORIA'
            },
            onExporting: function (e) {
                var workbook = new ExcelJS.Workbook();
                var worksheet = workbook.addWorksheet('REPORTE');

                DevExpress.excelExporter.exportDataGrid({
                    component: e.component,
                    worksheet: worksheet,
                    topLeftCell: { row: 2, column: 1 },
                }).then(function (dataGridRange) {
                    // header

                    var headerRow = worksheet.getRow(1);
                    headerRow.height = 30;

                    //Titles
                    var titleColumnRow = worksheet.getRow(2);
                    titleColumnRow.font = {
                        bold: true
                    };
                    for (var i = 1; i <= worksheet.actualColumnCount; i++) {
                        titleColumnRow.getCell(i).fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'BEDFE6' }
                        };
                    }

                    worksheet.mergeCells('A1:G1');
                    headerRow.getCell(1).value = 'REPORTE DE ARTICULOS POR CATEGORIA';
                    headerRow.getCell(1).font = { name: 'Segoe UI Light', size: 22, bold: true };
                    headerRow.getCell(1).alignment = { horizontal: 'left' };

                    // footer
                    var footerRowIndex = dataGridRange.to.row + 2;
                    var footerRow = worksheet.getRow(footerRowIndex);
                    worksheet.mergeCells(footerRowIndex, 1, footerRowIndex, 7);

                    footerRow.getCell(1).value = 'https://inventario.com/';
                    footerRow.getCell(1).font = { color: { argb: 'BFBFBF' }, italic: true };
                    footerRow.getCell(1).alignment = { horizontal: 'left' };
                }).then(function () {

                    workbook.xlsx.writeBuffer().then(function (buffer) {
                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'REPORTE_ARTICULOSPORCATEGORIA.xlsx');
                    });
                });
                e.cancel = true;
            }
        });
    }
    $('#btnGenerarReporte').on('click', function (e) {
        if ($('#formReporte').valid()) {
            GenerarReporte($('#txtNombre').val());
        }
    });

    $('#selCategoria').on('change', function () {
        var valor = $(this).val();
        GenerarReporte(valor);
    });
});