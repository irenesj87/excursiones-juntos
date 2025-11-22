/**
 * Define el tipo para una excursión, asegurando que todos los objetos
 * del mock cumplan con la misma estructura que espera la aplicación.
 */
export interface Excursion {
	id: string;
	name: string;
	area: string;
	difficulty: string;
	time: string;
}

/* Array de excursiones */
const excursions: Excursion[] = [
	{
		id: "0",
		name: "Cangas de Onís",
		area: "Centro-Este",
		difficulty: "Baja",
		time: "3 horas",
	},
	{
		id: "1",
		name: "Picos de Europa",
		area: "Este",
		difficulty: "Media",
		time: "4 horas",
	},
	{
		id: "2",
		name: "Picos de Europa",
		area: "Este",
		difficulty: "Alta",
		time: "5 horas",
	},
	{
		id: "3",
		name: "Picos de Europa",
		area: "Centro",
		difficulty: "Media",
		time: "2 horas",
	},
	{
		id: "4",
		name: "Ruta del Oso",
		area: "Este",
		difficulty: "Media",
		time: "4 horas",
	},
];

export default excursions;
