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
		name: "Bustio - Pendueles",
		description: `Un paseo sereno que teje su camino entre el valle fluvial de Bustio y la costa de Pendueles.
		Perfecta para una escapada tranquila, donde el sonido de las olas marca el ritmo de tus pasos.`,
		area: "Oeste",
		difficulty: "Baja",
		time: "3 horas",
	},
	{
		id: "1",
		name: "Cangas de Onís",
		description: `Viaja en el tiempo cruzando el legendario Puente Romano, emblema de Cangas de Onís.
		Sigue el murmullo del río Sella en una ruta familiar que combina historia y naturaleza.`,
		area: "Centro-Este",
		difficulty: "Baja",
		time: "4 horas",
		imgSrc: "/images/0.jpg",
		imgAlt: "Puente Romano de Cangas de Onís sobre el río Sella",
	},
	{
		id: "2",
		name: "Parque natural de Somiedo",
		description: `Explora el corazón salvaje de Somiedo, el reino del oso pardo. Descubre sus valles glaciares y las ancestrales cabañas de teito.`,
		area: "Centro",
		difficulty: "Media",
		time: "5 horas",
	},
	{
		id: "3",
		name: "Picos de Europa",
		description: `Conquista senderos que desafían las alturas y regalan vistas panorámicas que cortan la respiración.
		Una ruta exigente para espíritus aventureros.`,
		area: "Este",
		difficulty: "Alta",
		time: "6 horas",
		imgSrc: "/images/2.jpg",
		imgAlt: "Cumbres escarpadas de los Picos de Europa",
	},
	{
		id: "4",
		name: "Ruta del Silencio",
		description: `Adéntrate en un santuario natural donde el tiempo se detiene. Recorre senderos ancestrales bajo la sombra de castaños y robles, entre praderas que invitan a la calma.`,
		area: "Oeste",
		difficulty: "Alta",
		time: "5 horas",
	},
];

export default excursions;
