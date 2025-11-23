// Este archivo extiende las definiciones de tipos de Express.
// Permite añadir propiedades personalizadas al objeto Request de forma segura
// para que TypeScript las reconozca en toda la aplicación.

declare namespace Express {
	export interface Request {
		userMail: string;
	}
}
