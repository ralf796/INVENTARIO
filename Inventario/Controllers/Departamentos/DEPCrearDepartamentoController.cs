using Inventario.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Inventario.Controllers.Departamentos
{
    public class DEPCrearDepartamentoController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();
        // GET: PEDCrearDepartamento
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
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_DEPARTAMENTO>(datos);
                    obtenerDatos.ESTADO = "A";
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.CREADO_POR = Session["usuario"].ToString();
                    db.TBL_DEPARTAMENTO.Add(obtenerDatos);
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
                    string query = "SELECT * FROM TBL_DEPARTAMENTO WHERE ID_DEPARTAMENTO = " + id;
                    var editarTabla = db.Database.SqlQuery<TBL_DEPARTAMENTO>(query).SingleOrDefault();
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
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_DEPARTAMENTO>(datos);

                    string query = "SELECT * FROM TBL_DEPARTAMENTO WHERE ID_DEPARTAMENTO = " + obtenerDatos.ID_DEPARTAMENTO;
                    var editarTabla = db.Database.SqlQuery<TBL_DEPARTAMENTO>(query).SingleOrDefault();
                    editarTabla.ID_DEPARTAMENTO= obtenerDatos.ID_DEPARTAMENTO;
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
                string query = @"SELECT ID_DEPARTAMENTO, NOMBRE, CREADO_POR, CONVERT(VARCHAR(20), FECHA_CREACION) AS FECHA_CREACION, ESTADO FROM TBL_DEPARTAMENTO WHERE ESTADO='A'";
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
            public int? ID_DEPARTAMENTO { set; get; }
            public string NOMBRE { set; get; }
            public string CREADO_POR { set; get; }
            public string FECHA_CREACION { set; get; }
            public string ESTADO { set; get; }

        }

    }
}