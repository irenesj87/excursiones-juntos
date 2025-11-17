import { useCallback, useRef, type Dispatch } from "react";

/**
 * Define la forma del objeto que devuelve el hook `useMinDisplayTime`.
 */
interface UseMinDisplayTimeReturn<A> {
	/** Registra el tiempo de inicio. Debe llamarse justo antes de que comience la operación asíncrona. */
	startTiming: () => void;
	/** Envuelve la función dispatch para retrasar su ejecución hasta que se cumpla el `minDisplayTime`. */
	dispatchWithMinDisplayTime: (action: A) => void;
}

/**
 * Hook que proporciona una función de dispatch que respeta un tiempo de visualización mínimo.
 * Es útil para asegurar que los indicadores de carga (esqueletos) se muestren durante un
 * tiempo perceptible, evitando parpadeos rápidos en la UI.
 */
export const useMinDisplayTime = <A>(
	dispatch: Dispatch<A>,
	minDisplayTime = 300
): UseMinDisplayTimeReturn<A> => {
	const startTimeRef = useRef<number | null>(null);

	const startTiming = useCallback(() => {
		startTimeRef.current = Date.now();
	}, []);

	const dispatchWithMinDisplayTime = useCallback(
		(action: A) => {
			const startTime = startTimeRef.current ?? Date.now();
			const elapsedTime = Date.now() - startTime;
			const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

			setTimeout(() => {
				dispatch(action);
			}, remainingTime);
		},
		[dispatch, minDisplayTime]
	);

	return { startTiming, dispatchWithMinDisplayTime };
};
