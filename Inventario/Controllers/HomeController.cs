using Geminis.Clases;
using Inventario.Clases;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Inventario.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult IniciarSesion(string usuario, string password)
        {
            try
            {
                password = Encrypt.Instance.EncryptString(password.Trim().ToUpper());
                var catUsuario = Home.Instance.IniciarSesion(usuario.ToUpper(), password);
                if (catUsuario != null)
                {
                    Session["id_usuario"] = catUsuario.ID_USUARIO;
                    Session["usuario"] = catUsuario.USUARIO.ToString().ToUpper();
                    Session["nombre_usuario"] = catUsuario.NOMBRE.ToString();
                    Session["nombre_sucursal"] = catUsuario.SUCURSAL.ToString().ToUpper();
                    Session["CodigoModulo"] = catUsuario.MODULO;
                    string urlDefault = "";
                    var modulos = Home.Instance.ListarModulos(catUsuario.USUARIO);
                    if (modulos.Count > 0)
                        urlDefault = Home.Instance.ObtenerModulo(Convert.ToInt32(catUsuario.MODULO)).URL;
                    else
                    {
                        urlDefault = "/Home/Index";
                        return Json(new { Estado = -2, URL = urlDefault }, JsonRequestBehavior.AllowGet);
                    }
                    return Json(new { Estado = 1, URL = urlDefault }, JsonRequestBehavior.AllowGet);
                }
                else
                    return Json(new { Estado = -1 }, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(new { Estado = -3, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Método para obtener la lista de menu por módulo
        /// </summary>
        [SessionExpireFilter]
        public JsonResult ListarMenu()
        {
            var usuario = "";
            if (Session["usuario"] != null)
                usuario = Convert.ToString(Session["usuario"]);
            var codigoModulo = 0L;
            if (Session["CodigoModulo"] != null)
                codigoModulo = Convert.ToInt64(Session["CodigoModulo"]);
            var mod = Home.Instance.ObtenerModulo(Convert.ToInt32(codigoModulo));
            var listadoMenu = Home.Instance.ListarMenu(usuario, codigoModulo);
            return Json(new
            {
                Modulo = mod,
                Listado = listadoMenu
            }, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Método para obtener lista de módulos asignados al usuario
        /// </summary>
        /// <returns>Lista serializada a json de módulos asignados</returns>
        [SessionExpireFilter]
        public JsonResult ListarModulos()
        {
            var usuario = "";
            if (Session["usuario"] != null)
                usuario = Convert.ToString(Session["usuario"]);
            var modulos = Home.Instance.ListarModulos(usuario);
            return Json(new { ListadoModulos = modulos }, JsonRequestBehavior.AllowGet);
        }

        [SessionExpireFilter]
        public JsonResult ListarPantallas(string pantalla)
        {
            var usuario = "";
            if (Session["usuario"] != null)
                usuario = Convert.ToString(Session["usuario"]);

            var pantallas = Home.Instance.ListarPantallas(pantalla, usuario);

            return Json(new { ListadoPantallas = pantallas }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CerrarSesion()
        {
            FormsAuthentication.SignOut();
            Session.Abandon();
            return RedirectToAction("Index");
        }

    }
}