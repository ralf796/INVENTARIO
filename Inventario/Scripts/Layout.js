$(document).ready(function () {

    var listModulo = [];
    var niveles = 0;
    CargarMenu();
    CargarModulos();

    function CargarMenu() {
        $.ajax({
            type: 'GET',
            url: '/Home/ListarMenu',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: {},
            cache: false,
            success: function (response) {
                console.log(response);
                var modulo = response["Modulo"];
                listModulo = response["Listado"];
                ArmarModuloSidebar(modulo);
                ArmarMenu();
                SeleccionarMenu();
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    function CargarModulos() {
        $.ajax({
            type: 'GET',
            url: '/Home/ListarModulos',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: {},
            cache: false,
            success: function (response) {
                listModulo = response["ListadoModulos"];
                if (listModulo.length > 1) {
                    $("#liModulos").removeClass('d-none');
                    listModulo.forEach(function (modulo) {                        
                        AgregarModulo(modulo);
                    });
                }
                else {
                    $("#liModulos").addClass('d-none');
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

    function AgregarModulo(modulo) {
        $('#divModulos').append(
            '<a class="dropdown-item" href="' + modulo.URL + '">' +
            '   <i class="material-icons d-lg-none d-md-block">' + modulo.ICONO + '</i> ' + modulo.NOMBRE +
            '</a> ');
    }

    /**
     * Método para generar el código html de menú principal del módulo
     * @param {any} modulo
     */
    function ArmarModuloSidebar(modulo) {
        $('#ulMenuSideBar').append(
            '<li class="nav-item"> ' +
            '   <a class="nav-link" href="' + modulo.URL + '">' +
            '       <i class="material-icons">' + modulo.ICONO + '</i> ' +
            '       <p> ' + modulo.NOMBRE + ' </p> ' +
            '   </a> ' +
            '</li >');

        $('#titleModulo').html('Genesys | ' + modulo.NOMBRE);
    }

    /**
     * Método para armar el menú del módulo
     */
    function ArmarMenu() {
        niveles = Math.max.apply(Math, listModulo.map(function (menu) { return menu.NIVEL; }));
        if (listModulo.length > 0) {
            listModulo.forEach(function (menu) {
                if (menu.NIVEL == 1) {
                    AgregarNivel1(menu)
                }
            });
        }
    }

    /**
     * Método para armar el 1er. nivel del menú sidebar
     * @param {any} menu
     */
    function AgregarNivel1(menu) {        
        var icono = "";
        if (menu.ICONO != null)
            icono = menu.ICONO
        else
            icono = ObtenerIniciales(menu.ICONO);
        var liMenuSidebar = "li" + menu.NOMBRE.split(" ").join("");
        var hrefContenedorNivel2 = "components" + menu.NOMBRE.split(" ").join("");

        //var liMenuSidebar = "li" + menu.NOMBRE
        //var hrefContenedorNivel2 = "components" + menu.NOMBRE;
        $('#ulMenuSideBar').append(
            '<li id="' + liMenuSidebar + '" class="nav-item"> ' +
            '   <a class="nav-link" data-toggle="collapse" href="#' + hrefContenedorNivel2 + '"> ' +
            '       <i class="material-icons text-primary">' + icono + '</i> ' +
            '       <p> ' + menu.NOMBRE + ' ' +
            '          <b class="caret"></b> ' +
            '       </p > ' +
            '   </a> ' +
            '</li >');        
        AgregarNivel2(liMenuSidebar, hrefContenedorNivel2, menu.ID_MENU);
    }

    /**
     * Método para armar el 2do. nivel del menú sidebar
     * @param {any} liMenuSidebar
     * @param {any} contenedor
     * @param {any} codigoPadreNivel1
     */
    function AgregarNivel2(liMenuSidebar, contenedor, codigoPadreNivel1) {
        //Adición de div contenedor        
        $('#' + liMenuSidebar).append(
            '<div id="' + contenedor + '" class="collapse"></div >');
        var lista = []
        var listaPadres = []
        var contador = 0;
        var vNiveles = 0;
        var codigoPadreNivel2 = 0;

        listModulo.forEach(function (menu) {
            if (menu.PADRE == codigoPadreNivel1) {
                codMenu = menu.ID_MENU;
                lista.push(menu);
            }
        });        
        if (lista.length > 0) {

            lista.forEach(function (dato) {
                codigoPadreNivel2 = 0;
                listModulo.forEach(function (menu) {
                    if (dato.ID_MENU == menu.PADRE) {
                        codigoPadreNivel2 = menu.PADRE;

                        if (listaPadres.length == 0)
                            listaPadres.push(codigoPadreNivel2);
                        else {
                            listaPadres.forEach(function (data) {

                                if (data != codigoPadreNivel2)
                                    listaPadres.push(codigoPadreNivel2);
                            })
                        }
                    }
                });
            });

            listModulo.forEach(function (menu) {
                listaPadres.forEach(function (datos) {

                    if (menu.PADRE == datos) {
                        contador += 1;
                    }
                });
            });


            if (contador == 0)
                vNiveles = 2;
            else
                vNiveles = niveles;
            
            $('#' + contenedor).append(
                '<ul id="ul' + contenedor + '" class="nav"></ul >');
            var ulNivel2 = 'ul' + contenedor;

            if (vNiveles == 2) {
                lista.forEach(function (menu) {
                    $('#' + ulNivel2).append(
                        '<li class="nav-item"> ' +
                        '   <a class="nav-link" href = "' + menu.URL + '" > ' +
                        '       <span class="sidebar-mini"> ' + ObtenerIniciales(menu.NOMBRE) + ' </span>' +
                        '       <span class="sidebar-normal">' + menu.NOMBRE + '</span> ' +
                        '   </a> ' +
                        '</li >');
                });
            }

            if (vNiveles == 3) {
                var esPadre = 0;
                lista.forEach(function (menu) {
                    esPadre = 0;
                    listaPadres.forEach(function (datos) {                        
                        if (menu.ID_MENU == datos) {
                            esPadre += 1;
                        }
                    });

                    if (esPadre > 0) {
                        var icono = "opacity";

                        if (menu.ICONO != null)
                            icono = menu.ICONO

                        var hrefContenedorNivel3 = "collapse" + menu.NOMBRE.split(" ").join("");
                        var liNivel2 = 'li' + menu.NOMBRE.split(" ").join("");
                        $('#' + ulNivel2).append(
                            '<li id="' + liNivel2 + '" class="nav-item"> ' +
                            '   <a class="nav-link" data-toggle="collapse" href="#' + hrefContenedorNivel3 + '"> ' +
                            //'       <span class="sidebar-mini"> ' + ObtenerIniciales(menu.NOMBRE) + ' </span>' +
                            '       <i class="material-icons text-danger">' + icono + '</i> ' +
                            '       <span class="sidebar-normal"> ' +
                            '           ' + menu.NOMBRE + ' ' +
                            '           <b class="caret"></b>' +
                            '       </span> ' +
                            '   </a> ' +
                            '</li >');
                        AgregarNivel3(liNivel2, hrefContenedorNivel3, menu.ID_MENU);
                    }
                    else {
                        $('#' + ulNivel2).append(
                            '<li class="nav-item"> ' +
                            '   <a class="nav-link" href = "' + menu.URL + '" > ' +
                            '       <span class="sidebar-mini"> ' + ObtenerIniciales(menu.NOMBRE) + ' </span>' +
                            '       <span class="sidebar-normal">' + menu.NOMBRE + '</span> ' +
                            '   </a> ' +
                            '</li >');
                    }

                });
            }
        }
    }

    /**
     * Método para armar el 3er. nivel del menú sidebar
     * @param {any} liNivel2
     * @param {any} contenedor
     * @param {any} codigoPadreNivel2
     */
    function AgregarNivel3(liNivel2, contenedor, codigoPadreNivel2) {
        //Adición de div contenedor        
        $('#' + liNivel2).append(
            '<div id="' + contenedor + '" class="collapse"></div >');
        var lista = []
        listModulo.forEach(function (menu) {
            if (menu.PADRE == codigoPadreNivel2) {
                lista.push(menu);
            }
        });

        if (lista.length > 0) {
            $('#' + contenedor).append(
                '<ul id="ul' + contenedor + '" class="nav"></ul >');
            lista.forEach(function (menu) {
                var ulNivel3 = 'ul' + contenedor;
                var iniciales = ObtenerIniciales(menu.NOMBRE);
                $('#' + ulNivel3).append(
                    '<li class="nav-item"> ' +
                    '   <a class="nav-link" href="' + menu.URL + '">' +
                    '       <span class="sidebar-mini"> ' + iniciales + ' </span>' +
                    '       <span class="sidebar-normal">' + menu.NOMBRE + '</span> ' +
                    '   </a> ' +
                    '</li >');
            });
        }
    }

    function SeleccionarMenu() {
        var oldURL = window.location.href;
        var index = 0;
        var newURL = oldURL;
        index = oldURL.indexOf('?');
        if (index == -1) {
            index = oldURL.indexOf('#');
        }
        if (index != -1) {
            newURL = oldURL.substring(0, index);
        }
        $('.sidebar .nav-item .nav-link').filter(function () {
            if (this.href.toLowerCase() == newURL.toLowerCase()) {
                $(this).parents('.collapse').addClass('show');
                $(this).parent().addClass('active');
                var modulo = $(this).children('p').html();
                if (modulo)
                    $('#navTitle').text(modulo);
                else {
                    var nombreOpcion = $(this).children('.sidebar-normal').html();
                    $('#navTitle').text(nombreOpcion);
                }
            }
        });
    }

    /**
     * Método apra obtener iniciales de texto
     * @param {any} str texto a evaluar
     */
    function ObtenerIniciales(str) {

        str = RemoveAccents(str.replaceAll({ 'DE': '', 'POR': '' }));
        var matches = "";
        if (ContarPalabras(str) == 1) {
            matches = str.match(/\b(\w{2})/g);
        }
        else {
            matches = str.match(/\b(\w)/g);
        }
        var acronym = matches.join('');
        return acronym;
    }

    /**
     * Método que permite obtener el número de palabras que posee un texto exluyendo espacios
     * @param {any} value
     */
    function ContarPalabras(value) {
        //Contar palabras del texto.
        return value.trim().replace(/\s+/gi, ' ').split(' ').length;
    }

    String.prototype.replaceAll = function (obj) {
        var retStr = this;
        for (var x in obj) {
            retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
        }
        return retStr;
    }

    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
        },
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (_index, item) {
                var li;
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                li = that._renderItemData(ul, item);
                if (item.category) {
                    li.attr("aria-label", item.category + " : " + item.label);
                }
            });
        }
    });

    $("#txtBusquedaPantalla").catcomplete({
        delay: 0,
        source: function (_request, response) {
            $.ajax({
                type: 'GET',
                url: '/Home/ListarPantallas',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                data: { pantalla: $('#txtBusquedaPantalla').val() },
                cache: false,
                success: function (data) {
                    response($.map(data, function (item) {
                        return item;
                    }))
                },
                error: function (jqXHR, ex) {
                    getErrorMessage(jqXHR, ex);
                }
            });
        },
        minLength: 1,
        focus: function (_event, ui) {
            $("#txtBusquedaPantalla").val(ui.item.label);
            return false;
        },
        select: function (_event, ui) {
            if (!isNullOrEmpty(ui.item.value)) {
                window.location.href = ui.item.value;
            }
            return false;
        }
    });

    //EVENTO DE BOTON ACTUALIZAR CONTRASEÑA
    $('#btnContrasenaNavBar').on('click', function (e) {
        e.preventDefault();
        if ($('#formContrasenaNavBar').valid()) {
            CambiarContrasena($('#txtContrasenaNavBar').val(), $('#txtContrasenaNuevaNavBar').val());
        }
    });

    $('#lblCambiarContrasena').on('click', function (e) {
        $('#modalContrasenaNavBar').modal('show');
    });

    function CambiarContrasena(ContrasenaActual, ContrasenaNueva) {

        if (ContrasenaActual == ContrasenaNueva) {
            swal('La contraseña actual debe diferente a la nueva', '', "error");
            return;
        }

        CallLoadingFire();
        $.ajax({
            type: 'GET',
            url: '/Home/ValidarContrasena',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: { ContrasenaActual, ContrasenaNueva },
            cache: false,
            success: function (data) {
                var state = data["ESTADO"];
                if (state == 1) {
                    $('#txtContrasenaNavBar').val('');
                    $('#txtContrasenaNuevaNavBar').val('');
                    $('#txtContrasenaVerifNavBar').val('');
                    $('#modalContrasenaNavBar').modal('hide');
                    swal('Contraseña cambiada con exito!','', "success");
                }

                else if (state == -1) {
                    swal(data["MENSAJE"], ' ', "error");
                }
            },
            error: function (jqXHR, ex) {
                getErrorMessage(jqXHR, ex);
            }
        });
    }

});