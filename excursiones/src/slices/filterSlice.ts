import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Define la estructura del estado de los filtros.
 */
export interface FilterState {
	area: string[];
	difficulty: string[];
	time: string[];
}

const initialState: FilterState = {
	area: [],
	difficulty: [],
	time: [],
};

export const filterSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		toggleFilter: (
			state,
			action: PayloadAction<{ filterType: keyof FilterState; value: string }>
		) => {
			const { filterType, value } = action.payload;

			// TypeScript se asegura de que filterType es una clave válida de FilterState
			const filterArray = state[filterType];
			const index = filterArray.indexOf(value);

			if (index === -1) {
				// Si el filtro no está en el array, lo añadimos.
				filterArray.push(value);
			} else {
				// Si el filtro ya está, lo eliminamos.
				filterArray.splice(index, 1);
			}
		},

		clearAllFilters: (state) => {
			state.area = [];
			state.difficulty = [];
			state.time = [];
		},
	},
});

// Exportamos las acciones para que puedan ser usadas en los componentes.
export const { toggleFilter, clearAllFilters } = filterSlice.actions;

export default filterSlice.reducer;
