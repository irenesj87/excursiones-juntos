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
	image: string;
}

/* Array de excursiones */
const excursions: Excursion[] = [
	{
		id: "0",
		name: "Cangas de Onís",
		area: "Centro-Este",
		difficulty: "Baja",
		time: "3 horas",
		image: "1.jpg",
	},
	{
		id: "1",
		name: "Picos de Europa",
		area: "Este",
		difficulty: "Media",
		time: "4 horas",
		image: "2.jpg",
	},
	{
		id: "2",
		name: "Picos de Europa",
		area: "Este",
		difficulty: "Alta",
		time: "5 horas",
		image: "3.jpg",
	},
];

export default excursions;
