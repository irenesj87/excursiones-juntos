import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { cn } from "../../lib/utils";
import heroImage from "../../assets/images/hero-background.jpg";
import heroImageAvif from "../../assets/images/hero-background.avif";
import CustomLink from "../../ui/Link/CustomLink";
import { ROUTES } from "../../constants";

const HERO_CONTENT = {
	title: "Respira, Camina, Conecta",
	subtitle:
		"Adéntrate en paisajes inolvidables y comparte experiencias únicas con tus compañeros de viaje.",
	cta: "Crea tu cuenta",
};

/**
 * Representa la sección principal de la cabecera (Hero) de la página.
 * Muestra una imagen de fondo inspiradora y el título principal.
 */
export function Hero() {
	// Obtenemos el estado de login desde Redux.
	const { login: isLoggedIn } = useSelector(
		(state: RootState) => state.loginReducer,
	);

	return (
		<section
			className="relative flex flex-col items-center justify-center h-[40vh] min-h-[450px] max-h-[600px] px-6 text-center text-white overflow-hidden"
			aria-label="Cabecera principal con imagen de musgo"
		>
			<picture className="contents">
				{/* Formato AVIF: Prioridad alta por ser más ligero */}
				<source
					srcSet={`${heroImageAvif} 1920w`}
					sizes="100vw"
					type="image/avif"
				/>
				{/* Fallback: JPG original para navegadores que no soporten AVIF */}
				<img
					className="absolute inset-0 w-full h-full object-cover object-[center_16%] z-0"
					src={heroImage}
					alt=""
					loading="eager" // Prioridad alta para LCP
					fetchPriority="high" // Refuerza la prioridad de carga
					width={1920}
					height={1080}
				/>
			</picture>

			{/* Overlay oscuro para contraste WCAG (Uso de color "Dark Moss" #192a23 al 50%) */}
			<div
				className="absolute inset-0 bg-[#192a23]/50 z-10"
				aria-hidden="true"
			/>

			<div
				className={cn(
					"relative z-20 flex flex-col items-center gap-8 md:gap-12 w-full max-w-[1000px] pt-[calc(var(--navbar-height)+3rem)] pb-20 lg:pt-navbar lg:pb-8",
					isLoggedIn && "pb-12 gap-4",
				)}
			>
				<div className="flex flex-col items-center gap-4 w-full px-4">
					<h1 className="font-sans text-[2.5rem] md:text-[3.5rem] font-normal leading-[1.1] tracking-tight [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
						{HERO_CONTENT.title}
					</h1>
					<p className="text-base md:text-lg lg:text-xl font-normal max-w-[600px] [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
						{HERO_CONTENT.subtitle}
					</p>
					{!isLoggedIn && (
						<CustomLink
							to={ROUTES.REGISTER}
							className="mt-4 md:mt-8 bg-white text-stone-900 px-8 py-3 md:px-10 md:py-4 text-lg md:text-xl font-semibold rounded-full shadow-soft hover:shadow-premium hover:bg-stone-50 transition-all duration-200 active:scale-[0.98]"
						>
							{HERO_CONTENT.cta}
						</CustomLink>
					)}
				</div>
			</div>
		</section>
	);
}
