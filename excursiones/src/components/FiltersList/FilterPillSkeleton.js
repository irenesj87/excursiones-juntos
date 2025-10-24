import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Componente que muestra un esqueleto de carga con la forma de una píldora de filtro.
 * @returns {React.ReactElement} - El componente del esqueleto de la píldora de filtro.
 */
function FilterPillSkeleton() {
	// La propiedad `vertical-align: 'middle'` soluciona el problema de alineación sin introducir espaciado vertical no deseado.
	// Por defecto, los elementos inline-block se alinean por su 'baseline', lo que causa un desajuste entre un esqueleto
	// (sin texto) y una píldora real (con texto).'middle' alinea el centro vertical del esqueleto con el centro del texto de los
	// elementos adyacentes,logrando una alineación visualmente perfecta y manteniendo el espaciado correcto entre filas.
	return (
		<Skeleton
			height={38}
			borderRadius={20}
			style={{ verticalAlign: "middle" }}
		/>
	);
}

export default FilterPillSkeleton;
