import express, { Request, Response } from "express";
import filtersData from "../data/excursionsData.js";

const router = express.Router();

// Definimos los tipos de filtro permitidos para mayor seguridad.
const ALLOWED_FILTERS = ["area", "difficulty", "time"] as const;
type AllowedFilter = (typeof ALLOWED_FILTERS)[number];

// Guarda de tipo para verificar si el filtro es uno de los permitidos.
const isAllowedFilter = (type: any): type is AllowedFilter => {
	return ALLOWED_FILTERS.includes(type);
};

/** GET */
// http://localhost:3001/filters?type=area
// http://localhost:3001/filters?type=difficulty
// http://localhost:3001/filters?type=time
router.get("/", (req: Request, res: Response) => {
	// Variable que tiene el tipo de filtro que se necesita en ese momento
	const filterType = req.query["type"];

	// Usamos la guarda de tipo para validar el parámetro de la query.
	if (isAllowedFilter(filterType)) {
		// 1. Extrae todos los valores para el tipo de filtro especificado.
		//    Por ejemplo, si filterType es "area", allValuesForFilter será: ["Centro-Este", "Este", "Este", ...]
		//    La función flecha (excursion => excursion[filterType]) retorna implícitamente excursion[filterType].
		const allValuesForFilter = filtersData.map(
			(excursion) => excursion[filterType]
		);

		// 2. Usa un Set para obtener solo los valores únicos.
		//    Siguiendo el ejemplo, uniqueValuesSet sería: Set { "Centro-Este", "Este" }
		const uniqueValuesSet = new Set(allValuesForFilter);

		// 3. Convierte el Set de nuevo a un array para la respuesta JSON.
		//    uniqueValuesArray sería: ["Centro-Este", "Este"]
		const uniqueValuesArray = [...uniqueValuesSet];

		res.status(200).json(uniqueValuesArray);
	} else {
		res.status(400).json({ error: "Petición incorrecta al servidor" });
	}
});

export default router;
