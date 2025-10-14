const express = require("express");
const router = express.Router();
const excursions = require("../data/excursionsData");

/**
 * Función auxiliar para aplicar filtros. Ahora maneja tanto un string como un array de valores.
 * @param {Array} data - El array de excursiones a filtrar.
 * @param {string | string[]} filterValue - El valor del parámetro de la query (ej: "Centro" o ["Centro", "Este"]).
 * @param {string} property - La propiedad del objeto excursión a comparar (ej: "area").
 * @returns {Array} - El array de excursiones filtrado.
 */
const applyListFilter = (data, filterValue, property) => {
	const sourceItems = Array.isArray(filterValue)
		? filterValue
		: filterValue.toString().split(",");

	// Limpia los valores: quita espacios, convierte a minúsculas y descarta los vacíos.
	const filterItems = sourceItems
		.map((item) => item.toString().trim().toLowerCase())
		.filter((item) => item); // .filter(item => item) elimina strings vacíos

	// Si no hay items de filtro válidos después de limpiar, no se aplica ningún filtro.
	// Este bloque ahora es alcanzable si el usuario envía filtros vacíos (ej: ?area=,).
	if (filterItems.length === 0) {
		return data;
	}

	// Se filtran los datos retornando sólo aquellos cuya propiedad coincide con los items del filtro.
	return data.filter((excursion) =>
		filterItems.includes(excursion[property].toLowerCase())
	);
};

/** GET */
router.get("/", function (req, res) {
	/* req.query: En Express.js, req representa la petición HTTP. Es una propiedad de este objeto que tiene cualquier
     parámetro enviado en la URL. Por ejemplo, si alguien accede a /excursions?q=hiking&difficulty=easy, entonces
     req.query será { q:'hiking', difficulty:'easy' }. Se utiliza la letra 'q' porque viene de query, normalmente los desarrolladores 
	 utilizan esa letra cuando se hacen búsquedas */
	/* Variable que guarda el valor del parámetro 'q' de la petición HTTP. Si 'q' existe, su valor se guarda en 'search'.
	 * Si el parámetro 'q' no existe, la variable guarda un string vacío. Esto previene errores y asegura que 'search' siempre tenga un
	 * string con el que trabajar
	 */
	// Se extrae el parámetro de búsqueda 'q' y el resto de filtros en un objeto 'filters'
	const { q: search, ...filters } = req.query;

	// Copy variable of the excursions array, we use this to not change the info in the excursions array
	let excursionsCopy = [...excursions];

	// Si el usuario ha buscado algo en la barra de búsqueda
	if (search) {
		const searchLower = search.toString().toLowerCase();
		excursionsCopy = excursionsCopy.filter((excursion) =>
			excursion.name.toLowerCase().includes(searchLower)
		);
	}

	// Lista de propiedades por las que se puede filtrar
	const filterableProperties = ["area", "difficulty", "time"];

	// Se aplican todos los filtros que el usuario haya enviado en la URL de forma dinámica recorriendo la lista
	// Esta línea inicia un bucle que va a recorrer los elementos del array filterableProperties. En cada pasada la variable property
	// tomará un valor
	filterableProperties.forEach((property) => {
		// Se comprueba si el filtro existe
		if (filters[property]) {
			// Si existe, se aplica el filtro
			excursionsCopy = applyListFilter(
				excursionsCopy,
				filters[property],
				property
			);
		}
	});

	res.status(200).json(excursionsCopy);
});

module.exports = router;
