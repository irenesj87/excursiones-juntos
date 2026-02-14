import React from "react";
import { SearchIcon } from "../../../ui/Icons";
import styles from "./NoExcursionsFound.module.css";

const TITLE_MESSAGE = "No se encontraron excursiones con esas características.";
const SUBTITLE_MESSAGE =
	"Prueba a cambiar los filtros para refinar tu búsqueda.";

/**
 * Muestra un mensaje cuando no se encuentran excursiones que coincidan con los criterios de búsqueda.
 */
export function NoExcursionsFound() {
	return (
		<div className={styles.excursionsContainer} role="status">
			<div className={styles.messageNotFound}>
				<SearchIcon className={styles.messageIcon} aria-hidden="true" />
				<p className={styles.primaryMessage}>{TITLE_MESSAGE}</p>
				<p className={styles.secondaryMessage}>{SUBTITLE_MESSAGE}</p>
			</div>
		</div>
	);
}

