import type { JwtPayload } from "jsonwebtoken";

/**
 * Extiende el payload estándar de JWT para incluir la propiedad `mail`,
 * que usamos para identificar al usuario en nuestra aplicación.
 */
export interface CustomJwtPayload extends JwtPayload {
	mail: string;
}
