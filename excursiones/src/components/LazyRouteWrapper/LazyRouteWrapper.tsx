import React, { Suspense } from "react";

/**
 * Objeto inmutable y vacío para usar como `pageProps` cuando un componente de página no requiere ninguna prop.
 * Se exporta para garantizar la estabilidad referencial en toda la aplicación al usar `LazyRouteWrapper`.
 */
export const EMPTY_PAGE_PROPS = Object.freeze({});

/**
 * Props del componente LazyRouteWrapper.
 * Utiliza genéricos para permitir pasar props específicas al componente de página.
 */
interface LazyRouteWrapperProps<P extends object> {
	/** Componente de página que se cargará de forma perezosa. */
	readonly PageComponent: React.ComponentType<P>;
	/** Componente esqueleto que se mostrará mientras se carga la página. */
	readonly SkeletonComponent: React.ComponentType;
	/** Props que se pasarán al PageComponent. Para componentes sin props, utiliza la constante exportada `EMPTY_PAGE_PROPS`. */
	readonly pageProps: P;
}

/**
 * Componente que envuelve una ruta cargada de forma perezosa (lazy loading) con un esqueleto de carga.
 * Utiliza React.Suspense para mostrar un componente de esqueleto mientras se carga el componente de página.
 */
export function LazyRouteWrapper<P extends object>({
	PageComponent,
	SkeletonComponent,
	pageProps,
}: LazyRouteWrapperProps<P>): JSX.Element {
	return (
		<Suspense fallback={<SkeletonComponent />}>
			<PageComponent {...pageProps} />
		</Suspense>
	);
}
