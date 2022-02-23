using Inventario.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Inventario.Controllers.Reportes
{
    public class REPProductosController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();
        // GET: REPProductos
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCategorias()
        {
            try
            {
                string query = @"SELECT ID_CATEGORIA, NOMBRE FROM TBL_CATEGORIA WHERE ESTADO='A'";
                var lista = db.Database.SqlQuery<CATEGORIA>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GenerarReporte(string categoria)
        {
            try
            {
                string query = @"SELECT B.NOMBRE CATEGORIA, C.NOMBRE DEPARTAMENTO, A.NOMBRE ARTICULO, A.PRECIO, A.CANTIDAD, A.CREADO_POR, CONVERT(VARCHAR(20), A.FECHA_CREACION) AS FECHA_CREACION, A.ESTADO
                                FROM TBL_PRODUCTO A
                                INNER JOIN TBL_CATEGORIA B ON A.ID_CATEGORIA=B.ID_CATEGORIA
                                LEFT JOIN TBL_DEPARTAMENTO C ON C.ID_DEPARTAMENTO=A.ID_DEPARTAMENTO
                                WHERE A.ID_CATEGORIA=" + categoria;
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
            public string CATEGORIA { set; get; }
            public string DEPARTAMENTO { set; get; }
            public string ARTICULO { set; get; }
            public decimal? PRECIO { set; get; }
            public decimal? CANTIDAD { set; get; }
            public string CREADO_POR { set; get; }
            public string FECHA_CREACION { set; get; }
            public string ESTADO { set; get; }
        }
        public class CATEGORIA
        {
            public int? ID_CATEGORIA { get; set; }
            public string NOMBRE { get; set; }
        }

    }
}