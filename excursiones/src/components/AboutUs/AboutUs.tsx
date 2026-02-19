import React from "react";
import { BackpackIcon } from "../../ui/Icons";
import styles from "./AboutUs.module.css";

export function AboutUs() {
	return (
		<section className={styles.aboutUsSection} aria-labelledby="about-heading">
			<div className="py-lg-4">
				<div className="row justify-content-center">
					{/* Columna de Texto (Contenido) */}
					<div className="col-lg-8">
						<div className="about-content text-center">
							{/* Icono decorativo */}
							<div className={`${styles.textMoss} ${styles.icon}`}>
								<BackpackIcon />
							</div>
							{/* Eyebrow / Subtítulo pequeño */}
							<span
								className={`d-block mb-2 ${styles.eyebrow} ${styles.textMoss}`}
							>
								Sobre Nosotros
							</span>

							{/* Título Principal */}
							<h2 id="about-heading" className={`mb-3 ${styles.heading}`}>
								Explorando la naturaleza, <br />
								<strong className={styles.textMoss}>creando recuerdos.</strong>
							</h2>

							{/* Párrafo descriptivo */}
							<p className={styles.description}>
								En Excursiones Juntos, creemos que el camino es mejor cuando se
								comparte. Nacimos de la pasión por la montaña y el deseo de
								conectar a personas que buscan escapar de la rutina y respirar
								aire puro.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
