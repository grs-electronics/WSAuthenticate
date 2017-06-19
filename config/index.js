'use strict';

//
// Archivo de configuración del servidor
//

/**
 * Configuracion de los tokens de acceso.
 *
 * expiresIn               - El tiempo en minutos antes que el token expire. Por defecto es 60
 *                           minutos
 * calculateExpirationDate - Función que calcula el tiempo de expiración del token.
 */
exports.token = {
  expiresIn               : 60 * 60,
  calculateExpirationDate : () => new Date(Date.now() + (this.token.expiresIn * 1000)),
};

/**
 * Configuración del token.
 * expiresIn -Tiempo en minutos qu el token expira.  Por defecto 5 minutos.
 */
exports.codeToken = {
  expiresIn : 5 * 60,
};

/**
 * Configuración para refrescar el token.
 * expiresIn - Tiempo en minutos antes que el token expire.  Por defecto son 100 años.
 *             Es mejor cuando el token no expira.
 */
exports.refreshToken = {
  expiresIn : 52560000,
};

/**
 *  Configuración de la base de datos para acceder y refrescar tokens.
 *
 * timeToCheckExpiredTokens - Tiempo para revisar la base de datos cuando se expiran los tokens.
 *                            Por ejemplo, si se ingresan 3600, se tiene que esperar una hora para refrescar el token.
 */
exports.db = {
  timeToCheckExpiredTokens : 3600,
};

/**
 * Configuración de la sesión
 *
 * maxAge - El tiempo máximo de la sesión creada en el servidor.  Se utiliza null para la sesión en el navegador.
 *          Comunmente se usa algo mas grande como  3600000 * 24 * 7 * 52 equivalente a un año.
 * secret - La clave para encriptado de la sesión
 */
exports.session = {
  maxAge : 3600000 * 24 * 7 * 52,
  secret : 'b53f53e2e669873bb8ae840bae250f72b49e925d', // TODO: Define Secret -- GRS@S3CR3T_4pp -- Encriptado sha1
};
