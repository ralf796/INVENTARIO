using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace Geminis.Clases
{
    public class Encrypt
    {
        private static readonly Encrypt _instance = new Encrypt();

        public static Encrypt Instance => _instance ?? new Encrypt();

        public byte[] Clave = Encoding.ASCII.GetBytes("Grupo Tomza");
        public byte[] IV = Encoding.ASCII.GetBytes("Devjoker7.37hAES");

        /// <summary>
        /// Funcion para encriptar una cadena
        /// </summary>
        /// <param name="Cadena"></param>
        /// <returns>Retorna una cadena encriptada</returns>
        public string EncryptString(string Cadena)
        {

            byte[] inputBytes = Encoding.ASCII.GetBytes(Cadena);
            byte[] encripted;
            RijndaelManaged cripto = new RijndaelManaged();
            using (MemoryStream ms = new MemoryStream(inputBytes.Length))
            {
                using (CryptoStream objCryptoStream = new CryptoStream(ms, cripto.CreateEncryptor(Clave, IV), CryptoStreamMode.Write))
                {
                    objCryptoStream.Write(inputBytes, 0, inputBytes.Length);
                    objCryptoStream.FlushFinalBlock();
                    objCryptoStream.Close();
                }
                encripted = ms.ToArray();
            }
            return Convert.ToBase64String(encripted);
        }

        /// <summary>
        /// Funcion para desencriptar una cadena
        /// </summary>
        /// <param name="Cadena"></param>
        /// <returns>Retorna una cadena desencriptada</returns>
        public string Decrypt(string Cadena)
        {
            byte[] inputBytes = Convert.FromBase64String(Cadena);
            string textoLimpio = String.Empty;
            RijndaelManaged cripto = new RijndaelManaged();
            using (MemoryStream ms = new MemoryStream(inputBytes))
            {
                using (CryptoStream objCryptoStream = new CryptoStream(ms, cripto.CreateDecryptor(Clave, IV), CryptoStreamMode.Read))
                {
                    using (StreamReader sr = new StreamReader(objCryptoStream, true))
                    {
                        textoLimpio = sr.ReadToEnd();
                    }
                }
            }
            return textoLimpio;
        }

    }
}