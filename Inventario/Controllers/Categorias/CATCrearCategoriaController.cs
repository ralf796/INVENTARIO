using Inventario.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Inventario.Controllers.Categorias
{
    public class CATCrearCategoriaController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();
        // GET: CATCrearCategoria
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Guardar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_CATEGORIA>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    db.TBL_CATEGORIA.Add(obtenerDatos);
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
                    string query = "SELECT * FROM TBL_CATEGORIA WHERE ID_CATEGORIA = " + id;
                    var editarTabla = db.Database.SqlQuery<TBL_CATEGORIA>(query).SingleOrDefault();
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

        public JsonResult Editar(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_CATEGORIA>(datos);

                    string query = "SELECT * FROM TBL_CATEGORIA WHERE ID_CATEGORIA = " + obtenerDatos.ID_CATEGORIA;
                    var editarTabla = db.Database.SqlQuery<TBL_CATEGORIA>(query).SingleOrDefault();
                    editarTabla.ID_CATEGORIA= obtenerDatos.ID_CATEGORIA;
                    editarTabla.NOMBRE = obtenerDatos.NOMBRE;

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

        public JsonResult CargarTablaTipoMenu()
        {
            try
            {
                string query = @"SELECT ID_CATEGORIA, NOMBRE, CREADO_POR, CONVERT(VARCHAR(20), FECHA_CREACION) AS FECHA_CREACION, ESTADO FROM TBL_CATEGORIA WHERE ESTADO='A'";
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