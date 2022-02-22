using Inventario.Clases;
using Inventario.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace Inventario.Controllers.Usuarios
{   
    public class USUCrearEmpleadoController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();

        // GET: USUCrearEmpleado
        public ActionResult Index()
        {
            return View();
        }

        [SessionExpireFilter]
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_EMPLEADO>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = Utils.ObtenerFechaServidor();
                    db.TBL_EMPLEADO.Add(obtenerDatos);
                    db.SaveChanges();
                    transaccion.Commit();
                    return Json(new { Estado = 1 }, JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    transaccion.Rollback();
                    return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
                }
            }
        }

        public JsonResult CargarTablaEmpleado()
        {
            try
            {
                string query = @"SELECT 
                                A.ID_EMPLEADO,
	                            A.NOMBRE,
	                            A.ESTADO,
	                            CONVERT(VARCHAR(20),
                                A.FECHA_CREACION) AS FECHA_CREACION
                            FROM TBL_EMPLEADO A";
                var lista = db.Database.SqlQuery<TABLA_EMPLEADO_>(query).ToList();
                return Json(new { ESTADO = 1, data = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public class TABLA_EMPLEADO_
        {
            public int? ID_EMPLEADO { set; get; }
            public string NOMBRE { set; get; }
            public string ESTADO { set; get; }
            public string FECHA_CREACION { set; get; }
        }
    }
}