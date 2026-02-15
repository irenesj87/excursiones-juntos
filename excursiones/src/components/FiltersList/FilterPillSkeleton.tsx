import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PILL_HEIGHT = 38; // Ajustado al nuevo padding (0.4rem) + line-height
const PILL_BORDER_RADIUS = 12; // Coincide con --border-radius-pill
const PILL_WIDTH = 90; // Ancho promedio para simular el contenido en flexbox
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
			width={PILL_WIDTH}
			borderRadius={PILL_BORDER_RADIUS}
			style={SKELETON_STYLE}
		/>
	);
}

export default FilterPillSkeleton;
