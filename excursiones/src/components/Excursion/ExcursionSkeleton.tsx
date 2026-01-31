import React from "react";
import { Container } from "react-bootstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSkeletonTheme } from "../../hooks/useSkeletonTheme";
import styles from "./Excursion.module.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Componente de esqueleto para la carga inicial de la página de detalle.
 * Replica la estructura de "Panel Dividido" para evitar saltos de contenido (CLS).
 */
function ExcursionSkeleton() {
    const { baseColor, highlightColor } = useSkeletonTheme();

    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <article className={styles.excursionPage} aria-hidden="true">
                <Container className={styles.pageContainer}>
                    <div className={styles.panel}>
                        {/* PANEL IZQUIERDO: Imagen + Título */}
                        <div className={styles.leftPanel}>
                            {/* Fondo de imagen */}
                            <div className={styles.imageContainer}>
                                <Skeleton
                                    height="100%"
                                    containerClassName="h-100 w-100 d-block"
                                />
                            </div>
                            {/* Contenido superpuesto (Título, Tags) */}
                            <div className={styles.heroContent}>
                                <div className="mb-4">
                                    <Skeleton width={100} /> {/* Volver */}
                                </div>
                                <div className="mb-3">
                                    <Skeleton height={48} width="70%" /> {/* Título */}
                                </div>
                                {/* Tags */}
                                <div className={styles.metaTags}>
                                    <Skeleton width={80} height={32} borderRadius={50} />
                                    <Skeleton width={80} height={32} borderRadius={50} />
                                    <Skeleton width={80} height={32} borderRadius={50} />
                                </div>
                            </div>
                        </div>

                        {/* PANEL DERECHO: Descripción + Acción */}
                        <div className={styles.rightPanel}>
                            <div className={styles.descriptionWrapper}>
                                <div className="mb-4">
                                    <Skeleton width={200} height={24} /> {/* Subtítulo */}
                                </div>
                                <Skeleton count={5} /> {/* Descripción */}
                            </div>

                            <div className={styles.actionWrapper}>
                                <Skeleton height={56} borderRadius={50} /> {/* Botón grande */}
                            </div>
                        </div>
                    </div>
                </Container>
            </article>
        </SkeletonTheme>
    );
}

export default ExcursionSkeleton;
