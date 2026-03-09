/**
 * Constantes para los niveles de dificultad de las excursiones.
 */
export const DIFFICULTY_LEVELS = {
	LOW: "Baja",
	MEDIUM: "Media",
	HIGH: "Alta",
} as const;

/**
 * Extrae los valores del objeto `DIFFICULTY_LEVELS` para crear un tipo de unión.
 */
type Difficulty = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

/**
 * Define el tipo para una excursión.
 */
export interface Excursion {
	/** El identificador único de la excursión, utilizado para referencias internas. */
	id: string;
	/** El nombre de la excursión. */
	name: string;
	/** Una descripción detallada de la excursión, que puede incluir información sobre el paisaje, puntos de interés y recomendaciones. */
	description: string;
	/** La zona geográfica donde se realiza la excursión. */
	area: string;
	/** El nivel de dificultad, basado en las constantes predefinidas. */
	difficulty: Difficulty;
	/** La duración estimada de la excursión. */
	time: string;
	/** La URL de la imagen representativa de la excursión. */
	imgSrc?: string;
	/** El texto alternativo para la imagen, utilizado para accesibilidad y SEO. */
	imgAlt?: string;
}

/* Array de excursiones */
const excursions: Excursion[] = [
	{
		id: "0",
		name: "Bulnes",
		description: `Descubre un pueblo escondido entre montañas, accesible solo a pie o en funicular.`,
		area: "Este",
		difficulty: DIFFICULTY_LEVELS.MEDIUM,
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
		difficulty: DIFFICULTY_LEVELS.LOW,
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
		difficulty: DIFFICULTY_LEVELS.HIGH,
		time: "6 horas",
		imgSrc: "/images/2.jpg",
		imgAlt:
			"Afiladas cumbres de roca caliza de los Picos de Europa emergiendo por encima de un mar de nubes.",
	},
];

export default excursions;
