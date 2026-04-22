import { COMPANY_NAME, START_YEAR } from "../../constants";
import { CopyrightIcon, MailIcon } from "../../ui/Icons";

const COPYRIGHT_TEXT = "Todos los derechos reservados.";
const CONTACT_EMAIL = "hola@excursionesjuntos.com";

/**
 * Componente del pie de página que muestra la información de copyright y el correo de contacto.
 */
export function Footer(): JSX.Element {
	const currentYear = new Date().getFullYear();
	const yearDisplay: string | number =
		START_YEAR === currentYear ? START_YEAR : `${START_YEAR} - ${currentYear}`;

	return (
		<footer className="flex flex-col items-center justify-center py-12 px-8 text-center bg-stone-900 text-stone-100 border-t border-white/5">
			<a
				href={`mailto:${CONTACT_EMAIL}`}
				className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors duration-200 no-underline hover:underline underline-offset-4"
			>
				<MailIcon aria-hidden="true" /> {CONTACT_EMAIL}
			</a>
			<small className="mt-6 text-sm leading-relaxed tracking-wide flex flex-col sm:flex-row items-center gap-1 text-stone-200">
				<CopyrightIcon
					className="text-[1.1em] text-stone-400 align-middle mb-[0.2em]"
					aria-hidden="true"
				/>{" "}
				<span className="font-bold uppercase tracking-wider">
					{COMPANY_NAME}
				</span>{" "}
				<span>
					{yearDisplay}. {COPYRIGHT_TEXT}
				</span>
			</small>
			<p className="mt-8 text-[10px] sm:text-xs leading-normal uppercase tracking-[0.5px] text-stone-500 max-w-[40ch]">
				Proyecto de desarrollo web para portfolio. Sin fines comerciales.
			</p>
		</footer>
	);
}
