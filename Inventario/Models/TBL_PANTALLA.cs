//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inventario.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class TBL_PANTALLA
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public TBL_PANTALLA()
        {
            this.TBL_PERMISO_PANTALLA = new HashSet<TBL_PERMISO_PANTALLA>();
        }
    
        public int ID_PANTALLA { get; set; }
        public string NOMBRE { get; set; }
        public string URL_PANTALLA { get; set; }
        public string DESCRIPCION { get; set; }
        public int ID_MODULO { get; set; }
        public Nullable<int> NIVEL { get; set; }
        public Nullable<int> PADRE { get; set; }
        public Nullable<int> ORDEN { get; set; }
        public string ICONO { get; set; }
        public string ESTADO { get; set; }
        public Nullable<int> PRINCIPAL { get; set; }
    
        public virtual TBL_MODULO TBL_MODULO { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<TBL_PERMISO_PANTALLA> TBL_PERMISO_PANTALLA { get; set; }
    }
}
