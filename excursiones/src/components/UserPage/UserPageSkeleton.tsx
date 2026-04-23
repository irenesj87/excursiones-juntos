import { Skeleton } from "../../ui/skeleton";

/**
 * Identificadores estables para los campos del esqueleto.
 * Usar strings descriptivos en lugar de índices mejora la estabilidad referencial de React y la legibilidad.
 */
const SKELETON_FIELD_KEYS = [
	"sk-field-name",
	"sk-field-lastname",
	"sk-field-email",
	"sk-field-phone",
];

/**
 * Componente que muestra un esqueleto de carga para la página de perfil de usuario.
 * Simula la estructura de la `UserPage` mientras los componentes reales se cargan.
 * Cumple con WCAG AAA al proporcionar un estado visual sin parpadeos.
 */
function UserPageSkeleton(): JSX.Element {
	return (
		<main
			className="flex justify-center pt-10 min-h-[calc(100vh-var(--navbar-height))] w-full bg-background"
			aria-hidden="true"
		>
			<div className="w-11/12 xl:w-8/12 flex flex-col gap-8 pb-10">
				{/* Simulación del encabezado del perfil */}
				<div className="flex flex-col gap-4">
					<Skeleton className="h-10 w-48 rounded-md" />
					<Skeleton className="h-4 w-72 rounded-sm" />
				</div>

				{/* Simulación del formulario/tarjeta de información */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border rounded-lg border-border/50">
					{SKELETON_FIELD_KEYS.map((fieldKey) => (
						<div key={fieldKey} className="space-y-2">
							<Skeleton className="h-4 w-24 rounded-sm" />
							<Skeleton className="h-10 w-full rounded-md" />
						</div>
					))}
					<div className="md:col-span-2 flex justify-end gap-3 mt-4">
						<Skeleton className="h-10 w-28 rounded-md" />
						<Skeleton className="h-10 w-32 rounded-md" />
					</div>
				</div>
			</div>
		</main>
	);
}

export default UserPageSkeleton;
