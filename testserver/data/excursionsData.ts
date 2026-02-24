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
		name: "Bulnes",
		description: `Descubre un pueblo escondido entre montañas, accesible solo a pie o en funicular.`,
		area: "Este",
		difficulty: "Media",
		time: "4 horas",
		imgSrc: "/images/0.jpg",
		imgAlt:
			"Vista del pueblo de Bulnes enclavado en un valle profundo, con las imponentes cumbres de los Picos de Europa al fondo.",
	},
	{
		id: "1",
		name: "Cangas de Onís",
		description: `Viaja en el tiempo cruzando el legendario Puente Romano, emblema de Cangas de Onís.`,
		area: "Centro-Este",
		difficulty: "Baja",
		time: "4 horas",
		imgSrc: "/images/1.jpg",
		imgAlt:
			"El icónico Puente Romano de Cangas de Onís, con su arco peraltado y la Cruz de la Victoria colgando sobre el río Sella.",
	},
	{
		id: "2",
		name: "Picos de Europa",
		description: `Conquista senderos que desafían las alturas y regalan vistas panorámicas que cortan la respiración.`,
		area: "Este",
		difficulty: "Alta",
		time: "6 horas",
		imgSrc: "/images/2.jpg",
		imgAlt:
			"Afiladas cumbres de roca caliza de los Picos de Europa emergiendo por encima de un mar de nubes.",
	},
];

export default excursions;
