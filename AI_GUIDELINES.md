# Reglas de Desarrollo y Asistencia IA

## 1. Rendimiento y Carga:

- Si hay alguna librería o componente pesado que no sea imprescindible para cargar la página en un inicio utiliza lazy loading, si se puede.
- Recuerda que React Compiler está instalado, así que no sugieras memoización.

## 2. Estructura y Componentes:

- Descompón funciones y componentes extensos (más de 20-30 líneas) en unidades pequeñas con una única responsabilidad.
- Evita copiar y pegar; extrae la lógica o UI duplicada a custom hooks, utilidades o componentes reutilizables.
- Sustituye números y cadenas literales sueltas por constantes con nombres descriptivos (ej: MAX_RETRIES en lugar de 3).
- No utilices React.FC.
- Desestructura las props directamente en la firma del componente para mejorar la legibilidad y ver claramente las dependencias de dicho componente.
- Si hay una lista de elementos, usa un key único y estable. 
- Utiliza HTML semántico siempre que sea posible (ej: <button> en lugar de <div onClick...>, <main>, <article>).
- No uses !important.

## 3. Estado y Lógica:

- Separa la lógica de negocio de la UI (Presentational vs Container pattern). Extrae la lógica compleja, efectos y manejadores de estado a Custom Hooks con nombres descriptivos (ej: useProductFilters).

## 4. Accesibilidad y Color:

- Cumple estrictamente con el estándar WCAG 2.1 Nivel AA.
- Asegura un ratio de contraste de al menos 4.5:1 para texto normal y 3:1 para texto grande (18.66px+ negrita o 24px+) o componentes gráficos de interfaz (iconos, bordes de inputs).
- No confíes únicamente en el color para transmitir información (usa también iconos o texto).
- Verifica la accesibilidad en todas las variantes del tema (modo claro y oscuro).

## 5. TypeScript:

- Evita el uso de any. Si el tipo es verdaderamente desconocido, utiliza unknown y realiza 'type narrowing' (estrechamiento de tipos). Define interfaces o tipos explícitos para todas las props y respuestas de API.
- Usa 'Discriminated Unions' (uniones discriminadas) para manejar estados complejos de UI (ej: { status: 'loading' } | { status: 'success', data: T }) en lugar de múltiples booleanos opcionales.

## 6. Documentación:

- Prioriza nombres claros de variables y funciones sobre los comentarios.
- Añade comentarios TSDoc donde falten y sean necesarios. 
- Mantén todos los comentarios en español. 
- Evita comentar lo obvio. Los comentarios deben explicar el "porqué" de una decisión de código, no sólo el "qué" hace.
