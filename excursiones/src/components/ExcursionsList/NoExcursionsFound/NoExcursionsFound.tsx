import React from "react";
import { FiSearch } from "react-icons/fi";
import styles from "./NoExcursionsFound.module.css";

/**
 * Muestra un mensaje cuando no se encuentran excursiones que coincidan con los criterios de búsqueda.
 */
const NoExcursionsFound = () => (
	<div className={styles.excursionsContainer}>
		<output aria-live="polite" className={styles.messageNotFound}>
			<FiSearch className={styles.messageIcon} aria-hidden="true" />
			<p className={styles.primaryMessage}>
				No se encontraron excursiones con esas características.
			</p>
			<p className={styles.secondaryMessage}>
				Prueba a cambiar los filtros para refinar tu búsqueda.
			</p>
		</output>
	</div>
);

export default NoExcursionsFound;
