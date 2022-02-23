using Inventario.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Inventario.Controllers.Reportes
{
    public class REPCategoriaController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();
        // GET: REPCategoria
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GenerarReporte(string nombre)
        {
            try
            {
                string query = @"SELECT ID_CATEGORIA, NOMBRE, CREADO_POR, CONVERT(VARCHAR(20), FECHA_CREACION) AS FECHA_CREACION, ESTADO 
                                FROM TBL_CATEGORIA
                                WHERE NOMBRE LIKE '%" + nombre + "%'";
                var lista = db.Database.SqlQuery<TABLA>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public class TABLA
        {
            public int? ID_CATEGORIA { set; get; }
            public string NOMBRE { set; get; }
            public string CREADO_POR { set; get; }
            public string FECHA_CREACION { set; get; }
            public string ESTADO { set; get; }
        }

        
    }
}