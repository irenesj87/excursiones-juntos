import { UserInfoForm } from "../UserInfoForm";

/**
 * Componente que representa la página de perfil del usuario.
 */
function UserPage(): JSX.Element {
	return (
		<main className="flex justify-center pt-10 min-h-[calc(100vh-var(--navbar-height))] w-full bg-background transition-colors duration-200">
			{/* Contenedor responsivo que replica el layout 11/12 (xs/md) y 8/12 (xl) de Bootstrap */}
			<div className="w-[91.666667%] xl:w-[66.666667%] flex flex-col pb-10">
				<UserInfoForm />
			</div>
		</main>
	);
}

export default UserPage;
