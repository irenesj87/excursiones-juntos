import { BackpackIcon } from "../../ui/Icons";
import styles from "./AboutUs.module.css";

const CONTENT = {
	eyebrow: "Sobre Nosotros",
	title: {
		start: "Explorando la naturaleza,",
		highlight: "creando recuerdos.",
	},
	description:
		"En Excursiones Juntos, creemos que el camino es mejor cuando se comparte. Nacimos de la pasión por el senderismo y el deseo de conectar a personas que buscan escapar de la rutina y respirar aire puro.",
};

export function AboutUs() {
	return (
		<section
			className={styles.aboutUsSection}
			aria-labelledby="about-us-heading"
		>
			<div className={styles.container}>
				<div className={styles.icon} aria-hidden="true">
					<BackpackIcon />
				</div>
				<div className={styles.eyebrow}>{CONTENT.eyebrow}</div>
				<h2 id="about-us-heading" className={styles.heading}>
					{CONTENT.title.start}{" "}
					<span className={styles.textMoss}>{CONTENT.title.highlight}</span>
				</h2>
				<p className={styles.description}>{CONTENT.description}</p>
			</div>
		</section>
	);
}
