// Este array actuará como una base de datos en memoria para los tokens invalidados.
// En una aplicación de producción, esto debería ser reemplazado por una solución más persistente y escalable como Redis.
const tokenBlocklist: string[] = [];

export default tokenBlocklist;
