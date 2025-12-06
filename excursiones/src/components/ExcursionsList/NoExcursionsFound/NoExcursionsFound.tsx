import React from "react";
import {SearchIcon } from "../../shared/Icons";
import styles from "./NoExcursionsFound.module.css";

/**
 * Muestra un mensaje cuando no se encuentran excursiones que coincidan con los criterios de búsqueda.
 */
const NoExcursionsFound = () => (
	<div className={styles.excursionsContainer}>
		<output className={styles.messageNotFound}>
			<SearchIcon className={ styles.messageIcon} />
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
