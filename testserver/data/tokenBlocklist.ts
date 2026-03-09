/**
 * Almacena los tokens JWT invalidados (por ejemplo, después de un cierre de sesión).
 * Se utiliza un `Set` para una comprobación de existencia de alto rendimiento (O(1)),
 * lo que es ideal para una lista de bloqueo.
 *
 * En una aplicación de producción, esto debería ser reemplazado por una solución
 * más persistente y escalable como Redis.
 */
const tokenBlocklist = new Set<string>();

export default tokenBlocklist;
