using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using Inventario.Models;

namespace Inventario.Clases
{
    public class Utils
    {
        private static readonly Inventario_BDEntities db = new Inventario_BDEntities();
        private static string ObtenerConexion()
        {
            return ConfigurationManager.ConnectionStrings["genesysConnectionString"].ToString();
        }
        
        public static string ObtenerFecha()
        {
            return DateTime.Now.ToShortDateString();
        }
        public static DateTime ObtenerFechaServidor()
        {
            string query = "SELECT SYSDATETIME()";
            DateTime fechaServidor = db.Database.SqlQuery<DateTime>(query).FirstOrDefault();
            return fechaServidor;
        }
        public static TimeSpan ObtenerHoraServidor()
        {
            string query = "Select CONVERT(nvarchar(10), GETDATE(), 108)";
            TimeSpan fechaServidor = db.Database.SqlQuery<TimeSpan>(query).FirstOrDefault();
            return fechaServidor;
        }

        public static List<MOTIVO_ANULACION_> getMotivoAnulacion()
        {
            string query = "SELECT util_pkg.get_motivo_anulacion_fn() FROM DUAL";
            var json = db.Database.SqlQuery<string>(query).FirstOrDefault();
            var data = new JavaScriptSerializer().Deserialize<List<MOTIVO_ANULACION_>>(json);
            return data;
        }

        public enum Acciones : int
        {
            LISTAR = 1,
            INSERTAR = 2,
            ACTUALIZAR = 3,
            ELIMINAR = 4,
            GENERAR_REPORTE = 11
        }


        public class MOTIVO_ANULACION_
        {
            public int ID_MOTIVO_ANULACION { get; set; }
            public string DESCRIPCION { get; set; }
        }
        public class CLIENTE_
        {

            public decimal? CODIGO_REFERENCIA { get; set; }
            public string NIT { get; set; }
            public string NOMBRE_CLIENTE { get; set; }
            public string DIRECCION { get; set; }
            public string FORMA_PAGO { get; set; }
            public long? ID_CLIENTE { get; set; }
            public long? CORPORACION_CLIENTE { get; set; }
            public string CREDITO_BLOQUEADO { get; set; }
            public long? ID_CANAL_DISTRIBUCION { get; set; }
            public string AUTORIZADO_POR { get; set; }
            public long? APLICA_PERCEPCION { get; set; }
            public long? ID_SEGMENTACION { get; set; }
        }
        public class GenericResponse
        {
            public int ESTADO { get; set; }
            public string MENSAJE { get; set; }
            public int? ID_VALUE { get; set; }
        }
    }
}