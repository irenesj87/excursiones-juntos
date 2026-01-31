/**
 * Define el tipo para una excursión, asegurando que todos los objetos
 * del mock cumplan con la misma estructura que espera la aplicación.
 */
export interface Excursion {
	id: string;
	name: string;
	description: string;
	area: string;
	difficulty: "Baja" | "Media" | "Alta";
	time: string;
	imgSrc?: string;
	imgAlt?: string;
}

/* Array de excursiones */
const excursions: Excursion[] = [
	{
		id: "0",
		name: "Cangas de Onís",
		description:
			"Una ruta histórica que comienza en el icónico Puente Romano sobre el río Sella. Perfecta para disfrutar en familia, paseando por las calles empedradas y descubriendo la primera capital del Reino de Asturias.",
		area: "Centro-Este",
		difficulty: "Baja",
		time: "3 horas",
		imgSrc: "/images/0.jpg",
		imgAlt: "Puente Romano de Cangas de Onís sobre el río Sella",
	},
	{
		id: "1",
		name: "Parque Natural de Somiedo",
		description:
			"Adéntrate en uno de los paisajes más vírgenes de Asturias, hogar del oso pardo. Esta ruta te llevará a través de valles verdes y te permitirá ver las tradicionales cabañas de teito, ofreciendo una experiencia inmersiva en la biosfera.",
		area: "Centro",
		difficulty: "Baja",
		time: "3 horas",
	},
	{
		id: "2",
		name: "Picos de Europa",
		description:
			"Un desafío para los amantes de la alta montaña. Esta ruta atraviesa senderos rocosos y ofrece vistas panorámicas inigualables de las cumbres calizas. Requiere buena forma física y equipo adecuado para terreno escarpado.",
		area: "Este",
		difficulty: "Alta",
		time: "5 horas",
		imgSrc: "/images/2.jpg",
		imgAlt: "Cumbres escarpadas de los Picos de Europa",
	},
];

export default excursions;
