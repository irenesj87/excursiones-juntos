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
		<section className={styles.aboutUsSection} aria-labelledby="about-heading">
			<div>
				<div className="row justify-content-center">
					<div className="col-lg-8">
						<div className="about-content text-center">
							<div
								className={`${styles.textMoss} ${styles.icon}`}
								aria-hidden="true"
							>
								<BackpackIcon />
							</div>
							<span className={styles.eyebrow}>{CONTENT.eyebrow}</span>
							<h2 id="about-heading" className={styles.heading}>
								{CONTENT.title.start}{" "}
								<span className={styles.textMoss}>
									{CONTENT.title.highlight}
								</span>
							</h2>
							<p className={styles.description}>{CONTENT.description}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
