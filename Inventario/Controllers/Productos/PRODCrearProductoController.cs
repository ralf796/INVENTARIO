using Inventario.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Inventario.Controllers.Productos
{
    public class PRODCrearProductoController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();
        // GET: PRODCrearProducto
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetCategorias()
        {
            try
            {
                string query = "SELECT * FROM TBL_CATEGORIA WHERE ESTADO = 'A' ";
                var lista = db.Database.SqlQuery<TBL_CATEGORIA>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult GetDepartamentos()
        {
            try
            {
                string query = "SELECT * FROM TBL_DEPARTAMENTO WHERE ESTADO = 'A' ";
                var lista = db.Database.SqlQuery<TBL_DEPARTAMENTO>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// GUARDAR EN TABLA EMPLEADO
        /// </summary>
        /// <param name="datos"> DEVUELVE EL JSON DESDE EL JS</param>
        /// <returns></returns>
        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_PRODUCTO>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    db.TBL_PRODUCTO.Add(obtenerDatos);
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

        /// <summary>
        /// EDITAR TABLA
        /// </summary>
        /// <param name="datos"></param>
        /// <returns></returns>
        public JsonResult Editar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_PRODUCTO>(datos);

                    string query = "SELECT * FROM TBL_PRODUCTO WHERE ID_PRODUCTO = " + obtenerDatos.ID_PRODUCTO;
                    var editarTabla = db.Database.SqlQuery<TBL_PRODUCTO>(query).SingleOrDefault();
                    editarTabla.ID_PRODUCTO = obtenerDatos.ID_PRODUCTO;
                    editarTabla.NOMBRE = obtenerDatos.NOMBRE;
                    editarTabla.PRECIO = obtenerDatos.PRECIO;
                    editarTabla.CANTIDAD= obtenerDatos.CANTIDAD;
                    db.Entry(editarTabla).State = EntityState.Modified;
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

        public JsonResult Eliminar(string id)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = "SELECT * FROM TBL_PRODUCTO WHERE ID_PRODUCTO = " + id;
                    var editarTabla = db.Database.SqlQuery<TBL_PRODUCTO>(query).SingleOrDefault();
                    editarTabla.ESTADO = "I";
                    db.Entry(editarTabla).State = EntityState.Modified;
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

        /// <summary>
        /// CARGAR DATOS DE EMPLEADOS EN DEVEXTREME
        /// </summary>
        /// <returns></returns>
        public JsonResult CargarTablaMenu()
        {
            try
            {
                string query = @"SELECT 
                                A.ID_PRODUCTO,
	                            B.ID_CATEGORIA,
                                B.NOMBRE AS CATEGORIA, 
	                            A.NOMBRE,
	                            CONVERT(VARCHAR(20),
                                A.FECHA_CREACION) AS FECHA_CREACION, 
	                            A.CREADO_POR,
                                CONVERT(VARCHAR(20),
								A.PRECIO) AS PRECIO,
								A.ESTADO,
                                A.CANTIDAD,
                                ID_DEPARTAMENTO
                            FROM TBL_PRODUCTO A 
                            INNER JOIN TBL_CATEGORIA B ON A.ID_CATEGORIA=B.ID_CATEGORIA WHERE A.ESTADO='A'";
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
            public int? ID_PRODUCTO { set; get; }
            public int? ID_CATEGORIA { set; get; }
            public int? ID_DEPARTAMENTO { set; get; }
            public string CATEGORIA { set; get; }
            public string NOMBRE { set; get; }
            public string FECHA_CREACION { set; get; }
            public string CREADO_POR { set; get; }
            public string PRECIO { set; get; }
            public decimal? CANTIDAD { set; get; }
            public string ESTADO { set; get; }
        }
    }
}