/**
 * Método para mostrar notificacion de Sweet Alert
 * @param {any} from
 * @param {any} align
 * @param {any} icon
 * @param {any} message
 * @param {any} type
 */
function showNotification(from, align, icon, message, type) {
    $.notify({
        icon: icon,
        message: message
    },
        {
            type: type,
            timer: 1000,
            placement: {
                from: from,
                align: align
            }
        });
}

function showDeleteMessage(title, text) {
    return Swal.fire({
        title: title,
        text: text,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F44336',
        cancelButtonColor: '#BDBDBD',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    })
}

/**
 * Método para capturar objetos de error de método ajax
 * @param {any} jqXHR
 * @param {any} exception
 */
function getErrorMessage(jqXHR, exception) {
    var msg = '';
    var icon = 'error';
    var execute = true;
    if (jqXHR.status === 0) {
        msg = 'Sin Conexión.\n Verifique su red.';
    } else if (jqXHR.status == 401) {
        execute = false;
        $(location).attr('href', "/Home/Index?expirado=true");
    } else if (jqXHR.status == 403) {
        icon = 'warning';
        msg = 'Se nego el acceso a este sitio por que no posee los permisos necesarios, si desea obtener mas informacion por favor contacte al administrador del sistema';
    } else if (jqXHR.status == 410) {
        execute = false;
        $(location).attr('href', "/Home/PageNotFound");
    } else if (jqXHR.status == 404) {
        msg = 'Página solicitada no encontrada. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Error de servidor interno [500].';
    } else if (exception === 'parsererror') {
        msg = 'Error analizando JSON solicitado.';
    } else if (exception === 'timeout') {
        msg = 'Error de tiempo de espera.';
    } else if (exception === 'abort') {
        msg = 'Solicitud de AJAX abortada.';
    } else {
        msg = 'Error no detectado.\n' + jqXHR.responseText;
    }

    if (execute)
        showNotification('top', 'right', icon, msg, 'danger');
}

/**
 * Indica si el valor de la cadena especifícada es null o una cadena de string vacia
 * @param {any} s Cadena que se va a comparar.
 */
function isNullOrEmpty(s) {
    return (s == null || s === "");
}


/**
 * Método para convertir fecha de servidor a fecha Javascript
 * @param {string} value valor que se va a formatear
 * @param {string} outputFormat Formato de fecha deseado
 */
function ConvertToDate(value, outputFormat) {
    if (value) {
        if (typeof value === 'string') {
            var d = /\/Date\(((-?\d*)\d*)\)\//.exec(value);
            var fecha = moment(new Date(+d[1]));
            return fecha.format(outputFormat);
        }
    }
    return null;
}

/**
 * Permite iniciar div de loading en antes de cargas ajax y mediante callbak @AjaxStop Permitirá ocultarlo
 * @param {string} text Texto a mostrar en loading(si se omite mostrara Cargando...).
 */
function CallLoadingFire(text) {
    $('#divLoading').show();
    if (typeof text === 'undefined') {
        $('.fire-text').html('Cargando...');
    }
    else {
        $('.fire-text').html(text);
    }

    $(document).ajaxStop(function () {
        $('#divLoading').hide();
    });
}

/**
 * Método para remover acentos a texto
 * @param {string} strAccents 
 */
function RemoveAccents(strAccents) {
    var strAccents = strAccents.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
        if (accents.indexOf(strAccents[y]) != -1) {
            strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
        } else
            strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
}

/**
 * Método para capturar la URL y obtener parámetros
 * @param {string} sParam
 */
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
};

/**
    * Método para obtener todos los parametros que esten incluidos en la url
    * @param {string} url dirección de página web
    */
function getURLParams(url) {
    let params = {};
    new URLSearchParams(url.replace(/^.*?\?/, '?')).forEach(function (value, key) {
        params[key] = value
    });
    return params;
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

//funcion para poner la mascar a los números ejemplo le mandamos 25636 y nos devuelve 25,636
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

const formatToCurrency = amount => {
    return "" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

function formato_comas(datos) {
    var cadena = datos.toString();
    var dec = cadena.split(".");
    var cantidad = dec[0];
    var decimales = dec[1];
    var tokens = cantidad.split("");
    var tam = tokens.length;
    var resultado = "";
    var c1 = tam - 1;
    var c2 = 0;
    while (c1 > -1) {
        if (c2 > 2) {
            resultado = "," + resultado;
            c2 = 0;
        }
        resultado = tokens[c1] + resultado;
        c1 = c1 - 1;
        c2 = c2 + 1;
    }
    if (dec.length > 1) {
        resultado = resultado + "." + decimales;
    }
    return resultado;
}

function eliminarComas(numero) {
    //var valor = numero.toString().replace(",", "");
    //return valor.replace(",", "");
    return numero.toString().replace(/,/g, "");
}

function getFormaPagoCliente(object, pago) {
    $('.selectpicker').selectpicker();
    $(object).empty();

    switch (pago) {
        case "CO":
            $(object).append('<option value="CO">CONTADO</option>');
            break;
        case "CR":
            $(object).append('<option value="CR">CRÉDITO</option>');
            break;
        case "CC":
            $(object).append('<option value="CR">CRÉDITO</option>');
            $(object).append('<option value="CO">CONTADO</option>');
            break;
    }
    $('.selectpicker').selectpicker('refresh');
    if (pago == "CR")
        $(object).val('CR'.toString());
    else
        $(object).val('CO'.toString());

    $('.selectpicker').selectpicker('refresh');
}