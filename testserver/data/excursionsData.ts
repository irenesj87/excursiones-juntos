/**
 * Define el tipo para una excursión, asegurando que todos los objetos
 * del mock cumplan con la misma estructura que espera la aplicación.
 */
export interface Excursion {
	id: string;
	name: string;
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
		area: "Centro-Este",
		difficulty: "Baja",
		time: "3 horas",
		imgSrc: "/images/0.jpg",
		imgAlt: "Puente Romano de Cangas de Onís sobre el río Sella",
	},
	{
		id: "1",
		name: "Parque Natural de Somiedo",
		area: "Centro",
		difficulty: "Baja",
		time: "3 horas",
	},
	{
		id: "2",
		name: "Picos de Europa",
		area: "Este",
		difficulty: "Alta",
		time: "5 horas",
		imgSrc: "/images/2.jpg",
		imgAlt: "Cumbres escarpadas de los Picos de Europa",
	},
];

export default excursions;
