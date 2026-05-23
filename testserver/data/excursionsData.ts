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
		description: `Un refugio tallado en la roca donde el silencio es el único habitante. Siente la paz de un rincón olvidado por las prisas, protegido por la sombra de los Picos de Europa.`,
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
		description: `Camina sobre el susurro del río Sella. Un encuentro con la historia bajo la silueta del Puente Romano, donde la piedra antigua te invita a hacer una pausa.`,
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
		description: `Encuentra la calma en la inmensidad de las alturas. Un diálogo entre las nubes y la caliza donde cada paso te acerca a la belleza de lo esencial.`,
		area: "Este",
		difficulty: DIFFICULTY_LEVELS.HIGH,
		time: "6 horas",
		imgSrc: "/images/2.jpg",
		imgAlt:
			"Afiladas cumbres de roca caliza de los Picos de Europa emergiendo por encima de un mar de nubes.",
	},
	{
		id: "3",
		name: "Excursión 4",
		description: `Lore ipsum dolor sit amet, consectetur adipiscing elit.`,
		area: "Centro-Oeste",
		difficulty: DIFFICULTY_LEVELS.MEDIUM,
		time: "6 horas",
		imgSrc: "/images/3.jpg",
		imgAlt:
			"Lore ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "4",
		name: "Excursión 5",
		description: `Lore ipsum dolor sit amet, consectetur adipiscing elit.`,
		area: "Oeste",
		difficulty: DIFFICULTY_LEVELS.LOW,
		time: "1 hora",
		imgSrc: "/images/4.jpg",
		imgAlt:
			"Lore ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "5",
		name: "Excursión 6",
		description: `Lore ipsum dolor sit amet, consectetur adipiscing elit.`,
		area: "Centro",
		difficulty: DIFFICULTY_LEVELS.HIGH,
		time: "5 horas",
		imgSrc: "/images/5.jpg",
		imgAlt:
			"Lore ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "6",
		name: "Excursión 7",
		description: `Lore ipsum dolor sit amet, consectetur adipiscing elit.`,
		area: "Centro-Este",
		difficulty: DIFFICULTY_LEVELS.MEDIUM,
		time: "3 horas",
		imgSrc: "/images/6.jpg",
		imgAlt:
			"Lore ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "7",
		name: "Excursión 8",
		description: `Lore ipsum dolor sit amet, consectetur adipiscing elit.`,
		area: "Este",
		difficulty: DIFFICULTY_LEVELS.LOW,
		time: "2 horas",
		imgSrc: "/images/7.jpg",
		imgAlt:
			"Lore ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: "8",
		name: "Excursión 9",
		description: `Lore ipsum dolor sit amet, consectetur adipiscing elit.`,
		area: "Oeste",
		difficulty: DIFFICULTY_LEVELS.HIGH,
		time: "4 horas",
		imgSrc: "/images/8.jpg",
		imgAlt:
			"Lore ipsum dolor sit amet, consectetur adipiscing elit.",
	}
];

export default excursions;
