import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userSlice",
    initialState: {
        user: {}
    },
    reducers: {
        setUser: (state, { payload: userName }) => {
            state.user = {"userName": userName};
        },
        delUser: (state) => {
            state.user = {};
        }
    }
});

export const { setUser, delUser } = userSlice.actions;
export default userSlice.reducer;