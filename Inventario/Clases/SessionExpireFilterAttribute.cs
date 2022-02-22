using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Inventario.Clases
{
    public class SessionExpireFilterAttribute: AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            // Verificar si la sesión es compatible
            if (ctx.Session != null)
            {
                // Comprobar si se generó un nuevo ID de sesión
                if (ctx.Session["usuario"] == null || ctx.Session.IsNewSession)
                {
                    //-------------Verificar si es una soliciud AJAX----------------
                    if (filterContext.HttpContext.Request.IsAjaxRequest())
                    {
                        filterContext.HttpContext.Response.ClearContent();
                        filterContext.HttpContext.Items["AjaxSessionDenied"] = true;
                        filterContext.Result = new HttpUnauthorizedResult();
                    }
                    else
                        filterContext.Result = new RedirectResult("/Home/Index?expirado=true");
                }
            }
        }
    }
}