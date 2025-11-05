/**
 * Declaración de tipos para los módulos CSS.
 * Esto le dice a TypeScript cómo interpretar los archivos `.module.css`.
 */
declare module "*.module.css" {
	const classes: { readonly [key: string]: string };
	export default classes;
}
