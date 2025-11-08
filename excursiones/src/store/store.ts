import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "../slices/filterSlice";
import loginSlice from "../slices/loginSlice";
import themeSlice from "../slices/themeSlice";

// Esta es la store de la página. Este arhivo configura dicha store con los reducers de los slices
const store = configureStore({
	reducer: {
		loginReducer: loginSlice,
		filterReducer: filterSlice,
		themeReducer: themeSlice,
	},
});

// Infiere los tipos `RootState` y `AppDispatch` del propio store
export type RootState = ReturnType<typeof store.getState>;
// Tipo inferido: {loginReducer: LoginState, filterReducer: FilterState, themeReducer: ThemeState}
export type AppDispatch = typeof store.dispatch;

export default store;
