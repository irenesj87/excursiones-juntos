import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PILL_HEIGHT = 46;
const PILL_BORDER_RADIUS = 50;
/**
 * La propiedad `vertical-align: 'middle'` soluciona el problema de alineación sin introducir espaciado vertical no
 * deseado.
 * Por defecto, los elementos inline-block se alinean por su 'baseline', lo que causa un desajuste entre un esqueleto
 * (sin texto) y una píldora real (con texto).'middle' alinea el centro vertical del esqueleto con el centro del
 * texto de los elementos adyacentes,logrando una alineación visualmente perfecta y manteniendo el espaciado correcto
 * entre filas.
 */
const SKELETON_STYLE: React.CSSProperties = { verticalAlign: "middle" };

/**
 * Componente que muestra un esqueleto de carga con la forma de una píldora de filtro.
 */
function FilterPillSkeleton(): React.ReactElement {
	return (
		<Skeleton
			height={PILL_HEIGHT}
			borderRadius={PILL_BORDER_RADIUS}
			style={SKELETON_STYLE}
		/>
	);
}

export default FilterPillSkeleton;
