using Geminis.Clases;
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
    public class USUCrearUsuarioController : Controller
    {
        readonly Inventario_BDEntities db = new Inventario_BDEntities();
        // GET: USUCrearUsuario
        public ActionResult Index()
        {
            return View();
        }

        [SessionExpireFilter]
        public JsonResult GetDatos(string pUser)
        {
            try
            {
                var resultBusqueda = new RstBusqueda();
                string vQuery = @"SELECT
                                  B.ID_EMPLEADO,
                                  A.USUARIO,
                                  A.CONTRASEÑA,
                                  B.NOMBRE,
                                  CASE
                                    WHEN b.estado = 'A' THEN 'ACTIVO'
                                    ELSE 'INACTIVO'
                                  END ESTADO
                                FROM TBL_USUARIO A
                                INNER JOIN TBL_EMPLEADO B
                                  ON B.ID_EMPLEADO = A.ID_EMPLEADO
                                WHERE USUARIO = '" + pUser + "'";
                var DatosGenerales = db.Database.SqlQuery<DatosBusqueda>(vQuery).ToList();
                var json = JsonConvert.SerializeObject(DatosGenerales);
                List<DatosBusqueda> lista = JsonConvert.DeserializeObject<List<DatosBusqueda>>(json);
                foreach (DatosBusqueda lst in lista)
                {
                    resultBusqueda = new RstBusqueda
                    {
                        ID_EMPLEADO = lst.ID_EMPLEADO,
                        USUARIO = lst.USUARIO,
                        CONTRASEÑA = new Encrypt().Decrypt(lst.CONTRASEÑA),
                        NOMBRE = lst.NOMBRE,
                        ESTADO = lst.ESTADO
                    };
                };

                return Json(new { Estado = 1, DatoGeneral = resultBusqueda }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetEmpleados()
        {
            try
            {
                string query = @"SELECT A.ID_EMPLEADO, A.NOMBRE FROM TBL_EMPLEADO A
                                LEFT JOIN TBL_USUARIO B ON A.ID_EMPLEADO=B.ID_EMPLEADO
                                WHERE B.USUARIO IS NULL
                                ";
                var lista = db.Database.SqlQuery<EMPLEADO_>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult GetModulos()
        {
            try
            {
                string query = "SELECT ID_MODULO, NOMBRE FROM TBL_MODULO WHERE ESTADO='A'";
                var lista = db.Database.SqlQuery<MODULO_>(query).ToList();
                return Json(new { ESTADO = 1, DATA = lista }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Estado = -1, Mensaje = ex.Message.ToString() }, JsonRequestBehavior.AllowGet);
            }
        }


        [SessionExpireFilter]
        public JsonResult CrearUsuario(string datos)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    var obtenerDatos = JsonConvert.DeserializeObject<TBL_USUARIO>(datos);
                    obtenerDatos.CONTRASEÑA = new Encrypt().EncryptString(obtenerDatos.CONTRASEÑA);
                    obtenerDatos.FECHA_CREACION = DateTime.Now;
                    obtenerDatos.USUARIO = obtenerDatos.USUARIO;
                    db.TBL_USUARIO.Add(obtenerDatos);
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

        public JsonResult CambiarContraseña(string usuario, string contra)
        {
            using (var transaccion = db.Database.BeginTransaction())
            {
                try
                {
                    string query = @"UPDATE TBL_USUARIO SET CONTRASEÑA='" + new Encrypt().EncryptString(contra) + "' WHERE USUARIO='" + usuario + "'";
                    db.Database.ExecuteSqlCommand(query);
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

        public class DatosBusqueda
        {
            public string USUARIO { get; set; }
            public string ESTADO { get; set; }
            public string NOMBRE { get; set; }
            public int? ID_EMPLEADO { get; set; }
            public string CONTRASEÑA { get; set; }
        }
        public class RstBusqueda
        {
            public string USUARIO { get; set; }
            public string ESTADO { get; set; }
            public string NOMBRE { get; set; }
            public int? ID_EMPLEADO { get; set; }
            public string CONTRASEÑA { get; set; }
        }
        public class EMPLEADO_
        {
            public int? ID_EMPLEADO { get; set; }
            public string NOMBRE { get; set; }
        }
        public class MODULO_
        {
            public int? ID_MODULO { get; set; }
            public string NOMBRE { get; set; }
        }

    }
}