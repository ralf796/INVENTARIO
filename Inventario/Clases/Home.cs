using Inventario.Clases;
using Inventario.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace Geminis.Clases
{
    public class Home
    {
        private readonly Inventario_BDEntities db = new Inventario_BDEntities();

        private static readonly Home _instance = new Home();

        public static Home Instance => _instance ?? new Home();

        public USUARIO_ IniciarSesion(string usuario, string password)
        {
            string queryUsuario = @"SELECT
                                      USUARIO,
                                      NOMBRE,
                                        'SUMINISTROS' SUCURSAL,
                                      B.ID_MODULO MODULO
                                    FROM TBL_EMPLEADO A
                                    INNER JOIN TBL_USUARIO B
                                      ON A.ID_EMPLEADO = B.ID_EMPLEADO
                                    WHERE USUARIO = '" + usuario + @"'
                                    AND CONTRASEÑA = '" + password + "'" +
                                    "AND A.ESTADO='A'";

            return db.Database.SqlQuery<USUARIO_>(queryUsuario).FirstOrDefault();
        }

        public List<Menu> ListarMenu(string usuario, long modulo)
        {
            string queryMenu = @"SELECT
                                  m.id_pantalla id_menu,
                                  m.nombre,
                                  m.url_pantalla AS URL,
                                  m.descripcion,
                                  m.nivel,
                                  m.padre,
                                  m.icono,
                                  m.orden
                                FROM TBL_permiso_pantalla p
                                INNER JOIN TBL_pantalla m
                                  ON m.id_pantalla = p.id_pantalla
                                WHERE p.usuario = '" + usuario + @"'
                                AND m.id_modulo = " + modulo + @"
                                AND m.estado = 'A'
                                AND m.principal <> 1
                                ORDER BY m.nivel,
                                m.orden";

            return db.Database.SqlQuery<Menu>(queryMenu).ToList();
        }

        public Modulo ObtenerModulo(int modulo)
        {
            string query = @"SELECT
                              mo.id_modulo,
                              mo.nombre,
                              mo.descripcion,
                              mo.icono,
                              me.url_PANTALLA AS url
                            FROM TBL_modulo mo
                            LEFT JOIN TBL_PANTALLA me
                              ON mo.id_modulo = me.id_modulo
                              AND me.principal = 1
                              AND me.estado = 'A'
                            WHERE mo.id_modulo = " + modulo;
            return db.Database.SqlQuery<Modulo>(query).SingleOrDefault();
        }

        public Modulo ObtenerModuloPorURL(string URL)
        {
            string query = @"SELECT
                              mo.id_modulo,
                              mo.nombre,
                              mo.descripcion,
                              mo.icono,
                              ISNULL(me.url_pantalla, ' ') AS url
                            FROM TBL_modulo mo
                            LEFT JOIN TBL_pantalla me
                              ON mo.id_modulo = me.id_modulo
                            WHERE UPPER(me.url_pantalla) = UPPER('" + URL + @"')";
            return db.Database.SqlQuery<Modulo>(query).SingleOrDefault();
        }

        public List<Modulo> ListarModulos(string usuario)
        {
            string query = @"SELECT DISTINCT
                              mo.id_modulo,
                              mo.nombre,
                              mo.icono,
                              ISNULL((SELECT
                                url_pantalla
                              FROM TBL_pantalla
                              WHERE id_modulo = mo.id_modulo
                              AND principal = 1
                              AND estado = 'A'), ' ') AS url
                            FROM TBL_PERMISO_PANTALLA p
                            INNER JOIN TBL_PANTALLA me
                              ON me.id_pantalla = p.id_pantalla
                            LEFT JOIN TBL_MODULO mo
                              ON mo.id_modulo = me.id_modulo
                            WHERE p.usuario = '" + usuario + @"'
                            AND mo.estado = 'A'
                            ORDER BY mo.id_modulo";

            return db.Database.SqlQuery<Modulo>(query).ToList();
        }

        public List<Pantalla> ListarPantallas(string pantalla, string usuario)
        {
            string query = @"SELECT
                              m.nombre AS label,
                              m.url_PANTALLA AS value,
                              mod.nombre AS category
                            FROM TBL_PERMISO_PANTALLA p
                            INNER JOIN TBL_PANTALLA m
                              ON m.id_PANTALLA = p.id_PANTALLA
                            INNER JOIN TBL_MODULO mod
                              ON m.id_modulo = mod.id_modulo
                            WHERE m.nombre LIKE UPPER('%" + pantalla + @"%')
                            AND p.usuario = '" + usuario + @"'
                            AND m.estado = 'A'
                            AND m.principal <> 1
                            AND NOT EXISTS (SELECT
                              p.ID_PANTALLA
                            FROM TBL_PANTALLA p
                            WHERE p.padre = m.id_PANTALLA)
                            ORDER BY mod.nombre,
                            m.nombre";

            return db.Database.SqlQuery<Pantalla>(query).ToList();
        }

        public int TienePermiso(Utils.Acciones accion)
        {
            string controller = Convert.ToString(HttpContext.Current.Request.RequestContext.RouteData.Values["Controller"]);
            var usuario = "";

            if (HttpContext.Current.Session["id_usuario"] != null)
                usuario = Convert.ToString(HttpContext.Current.Session["id_usuario"]);

            string query = @"SELECT
                                    COUNT(*)
                                FROM
                                         svcfg_permiso p
                                    INNER JOIN svcfg_rol        r ON r.id_rol = p.id_rol
                                    INNER JOIN svcfg_accion_rol ar ON ar.id_rol = r.id_rol
                                    INNER JOIN svcat_accion     a ON a.id_accion = ar.id_accion
                                    INNER JOIN svcfg_menu       m ON m.id_menu = p.id_menu                                    
                                WHERE
                                        p.usuario = '" + usuario + @"'
                                    AND upper(regexp_substr(m.url, '\/(.*?)\/', 1, 1, NULL,
                                                            1)) = upper('" + controller + @"')
                                    AND a.id_accion = " + (int)accion;
            return db.Database.SqlQuery<int>(query).SingleOrDefault();
        }

        public string ObtenerDefaultModulo()
        {
            int codigoModulo = 0;
            if (HttpContext.Current.Session["CodigoModulo"] != null)
                codigoModulo = Convert.ToInt32(HttpContext.Current.Session["CodigoModulo"]);

            string query = @"SELECT
                              ISNULL(me.URL_PANTALLA, ' ') AS url
                            FROM TBL_MODULO mo
                            LEFT JOIN TBL_PANTALLA me
                              ON mo.id_modulo = me.id_modulo
                              AND me.principal = 1
                              AND me.estado = 'A'
                            WHERE mo.id_modulo =" + codigoModulo;
            return db.Database.SqlQuery<string>(query).SingleOrDefault();

        }

        public class Modulo
        {
            public int? ID_MODULO { get; set; }
            public string NOMBRE { get; set; }
            public string DESCRIPCION { get; set; }
            public string ICONO { get; set; }
            public string URL { get; set; }
        }

        public class Menu
        {
            public int ID_MENU { get; set; }
            public string NOMBRE { get; set; }
            public string URL { get; set; }
            public string DESCRIPCION { get; set; }
            public int NIVEL { get; set; }
            public int PADRE { get; set; }
            public string ICONO { get; set; }
            public int ORDEN { get; set; }
        }

        public class Pantalla
        {
            public string label { get; set; }
            public string value { get; set; }
            public string category { get; set; }
        }

        public class USUARIO_
        {
            public string USUARIO { get; set; }
            public string NOMBRE { get; set; }
            public string SUCURSAL { get; set; }
            public decimal? ID_MODULO { get; set; }
            public decimal? ID_USUARIO { get; set; }
            public int? MODULO { get; set; }
        }
    }
}