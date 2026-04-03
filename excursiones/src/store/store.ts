import { combineReducers, configureStore } from "@reduxjs/toolkit";
import filterSlice from "../slices/filterSlice";
import loginSlice from "../slices/loginSlice";
import themeSlice from "../slices/themeSlice";

// Exportamos el reducer raíz combinado para poder reutilizarlo en las pruebas.
export const rootReducer = combineReducers({
	loginReducer: loginSlice,
	filterReducer: filterSlice,
	themeReducer: themeSlice,
});

const store = configureStore({
	reducer: rootReducer,
});

// Infiere los tipos `RootState` y `AppDispatch` del propio store
export type RootState = ReturnType<typeof store.getState>;
// Tipo inferido: {loginReducer: LoginState, filterReducer: FilterState, themeReducer: ThemeState}
export type AppDispatch = typeof store.dispatch;

export default store;
