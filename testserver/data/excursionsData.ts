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
			"Descubre la histórica capital del Reino de Asturias, puerta de entrada a los Picos de Europa. Cruza su icónico Puente Romano sobre el río Sella y disfruta de su vibrante ambiente y gastronomía.",
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
			"Sumérgete en una Reserva de la Biosfera única, hogar del oso pardo cantábrico. Recorre sus valles glaciares, descubre los tradicionales 'teitos' y maravíllate con los Lagos de Saliencia.",
		area: "Centro",
		difficulty: "Baja",
		time: "3 horas",
	},
	{
		id: "2",
		name: "Picos de Europa",
		description:
			"Explora el corazón de la cordillera Cantábrica. Un paisaje de impresionantes macizos calizos, profundos valles y rutas legendarias como la del Cares o la subida a Bulnes.",
		area: "Este",
		difficulty: "Alta",
		time: "5 horas",
		imgSrc: "/images/2.jpg",
		imgAlt: "Cumbres escarpadas de los Picos de Europa",
	},
];

export default excursions;
