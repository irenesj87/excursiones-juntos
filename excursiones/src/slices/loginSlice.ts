import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface LoginState {
	login: boolean;
	user: User | null;
	token: string | null;
}

const initialState: LoginState = {
	login: false,
	user: null,
	token: null,
};

export const loginSlice = createSlice({
	name: "loginSlice",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<{ user: User; token: string }>) => {
			const { user, token } = action.payload;
			state.login = true;
			state.user = user;
			state.token = token;
		},
		logout: (state) => {
			return initialState;
		},
		updateUser: (state, action: PayloadAction<{ user: User }>) => {
			const { user } = action.payload;
			state.user = user;
		},
	},
});

export const { login, logout, updateUser } = loginSlice.actions;
export default loginSlice.reducer;
