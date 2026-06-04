import express, { Request, Response } from "express";
import excursions, { Excursion } from "../data/excursionsData.js";

const router = express.Router();

/**
 * Función auxiliar para aplicar filtros. Maneja tanto un string como un array de valores.
 * @param data - El array de excursiones a filtrar.
 * @param filterValue - El valor del parámetro de la query (ej: "Centro" o ["Centro", "Este"]).
 * @param property - La propiedad del objeto excursión a comparar (ej: "area").
 * @returns - El array de excursiones filtrado.
 */
const applyListFilter = (
	data: Excursion[],
	filterValue: unknown,
	property: keyof Pick<Excursion, "area" | "difficulty" | "time">,
): Excursion[] => {
	// Si el valor del filtro no es una cadena o un array, no se puede procesar.
	if (typeof filterValue !== "string" && !Array.isArray(filterValue)) {
		return data;
	}

	const sourceItems = Array.isArray(filterValue)
		? filterValue
		: filterValue.split(",");

	// Limpia los valores: quita espacios, convierte a minúsculas y descarta los vacíos.
	const filterItems = sourceItems
		.map((item) => item.toString().trim().toLowerCase())
		.filter(Boolean); // .filter(Boolean) elimina strings vacíos

	// Si no hay items de filtro válidos después de limpiar, no se aplica ningún filtro.
	if (filterItems.length === 0) {
		return data;
	}

	// Se filtran los datos retornando sólo aquellos cuya propiedad coincide con los items del filtro.
	return data.filter((excursion) =>
		filterItems.includes(excursion[property].toLowerCase()),
	);
};

/** GET */
router.get("/", (req: Request, res: Response) => {
	/* req.query: En Express.js, req representa la petición HTTP. Es una propiedad de este objeto que tiene cualquier
     parámetro enviado en la URL. Por ejemplo, si alguien accede a /excursions?q=hiking&difficulty=easy, entonces
     req.query será { q:'hiking', difficulty:'easy' }. Se utiliza la letra 'q' porque viene de query, normalmente los desarrolladores 
	 utilizan esa letra cuando se hacen búsquedas 
	 */
	/* Variable que guarda el valor del parámetro 'q' de la petición HTTP. Si 'q' existe, su valor se guarda en 'search'.
	 * Si el parámetro 'q' no existe, la variable guarda un string vacío. Esto previene errores y asegura que 'search' siempre tenga un
	 * string con el que trabajar
	 */
	// Se extrae el parámetro de búsqueda 'q' y el resto de filtros en un objeto 'filters'
	const { q, ...filters } = req.query;
	const search = q as string | undefined;
	let filteredExcursions = [...excursions];

	// Si el usuario ha buscado algo en la barra de búsqueda
	if (search) {
		const searchLower = search.toLowerCase();
		filteredExcursions = filteredExcursions.filter((excursion) =>
			excursion.name.toLowerCase().includes(searchLower),
		);
	}

	// Lista de propiedades por las que se puede filtrar
	const filterableProperties: ("area" | "difficulty" | "time")[] = [
		"area",
		"difficulty",
		"time",
	];
	// Se aplican los filtros de forma encadenada usando reduce para un código más funcional y conciso.
	filteredExcursions = filterableProperties.reduce(
		(currentExcursions, property) => {
			if (filters[property]) {
				return applyListFilter(currentExcursions, filters[property], property);
			}
			return currentExcursions;
		},
		filteredExcursions,
	);
	res.status(200).json(filteredExcursions);
});

/** GET para obtener una excursión por su ID */
router.get("/:id", (req: Request, res: Response) => {
	const { id } = req.params;
	const excursion = excursions.find((e) => e.id === id);
	if (excursion) {
		res.status(200).json(excursion);
	} else {
		res.status(404).json({ message: "Excursión no encontrada." });
	}
});

export default router;
