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
			"Una ruta histórica que comienza en el icónico Puente Romano sobre el río Sella. Perfecta para disfrutar en familia.",
		area: "Centro-Este",
		difficulty: "Baja",
		time: "3 horas",
		imgSrc: "/images/0.jpg",
		imgAlt: "Puente Romano de Cangas de Onís sobre el río Sella",
	},
	{
		id: "1",
		name: "Parque natural de Somiedo",
		description:
			"Hogar del oso pardo, esta ruta te llevará a través de valles verdes y te permitirá ver las tradicionales cabañas de teito.",
		area: "Centro",
		difficulty: "Baja",
		time: "3 horas",
	},
	{
		id: "2",
		name: "Picos de Europa",
		description:
			"En esta excursión atravesarás senderos rocosos de vistas panorámicas inigualables. Requiere buena forma física y equipo adecuado para terreno escarpado.",
		area: "Este",
		difficulty: "Alta",
		time: "5 horas",
		imgSrc: "/images/2.jpg",
		imgAlt: "Cumbres escarpadas de los Picos de Europa",
	},
];

export default excursions;
