import React, { Suspense } from "react";
import { Col } from "react-bootstrap";

/**
 * Props del componente LazyRouteWrapper.
 * Utiliza genéricos para permitir pasar props específicas al componente de página.
 */
interface LazyRouteWrapperProps<P extends object> {
	readonly PageComponent: React.ComponentType<P>; // Componente de página que se cargará de forma perezosa.
	readonly SkeletonComponent: React.ComponentType; // Componente esqueleto que se mostrará mientras se carga la página.
	readonly pageProps: P; // Props que se pasarán al PageComponent. Para componentes sin props, pasar un objeto vacío {}.
}

/**
 * Componente que envuelve una ruta cargada de forma perezosa (lazy loading) con un esqueleto de carga.
 * Utiliza React.Suspense para mostrar un componente de esqueleto mientras se carga el componente de página.
 */
const LazyRouteWrapper = <P extends object>({
	PageComponent,
	SkeletonComponent,
	pageProps,
}: LazyRouteWrapperProps<P>): JSX.Element => {
	return (
		<Col xs={12}>
			<Suspense fallback={<SkeletonComponent />}>
				<PageComponent {...pageProps} />
			</Suspense>
		</Col>
	);
};

export default LazyRouteWrapper;
