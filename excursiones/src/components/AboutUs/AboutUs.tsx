import { BackpackIcon } from "../../ui/Icons";
import styles from "./AboutUs.module.css";

const CONTENT = {
	eyebrow: "Nuestra Filosofía",
	title: {
		start: "Descubriendo el placer de",
		highlight: "explorar.",
	},
	description:
		"Para nosotros, la verdadera aventura no se mide en kilómetros, sino en la calma de un paisaje compartido y en las historias que nacen alrededor de un sendero. Nos une el respeto por el silencio de los bosques, la luz de la mañana y el compromiso de dejar una huella mínima en la tierra que tanto nos regala.",
};

export function AboutUs() {
	return (
		<section
			className={styles.aboutUsSection}
			aria-labelledby="about-us-heading"
		>
			<div className={styles.container}>
				<div className={styles.icon} aria-hidden="true">
					<BackpackIcon size="100%" />
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
