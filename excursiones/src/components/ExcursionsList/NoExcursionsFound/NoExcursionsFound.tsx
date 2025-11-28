import React from "react";
import {GoSearch } from "react-icons/go";
import styles from "./NoExcursionsFound.module.css";

const IconoLupa = GoSearch as React.ComponentType<{
	className: string
}>;

/**
 * Muestra un mensaje cuando no se encuentran excursiones que coincidan con los criterios de búsqueda.
 */
const NoExcursionsFound = () => (
	<div className={styles.excursionsContainer}>
		<output aria-live="polite" className={styles.messageNotFound}>
			<IconoLupa className={ styles.messageIcon} />
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
