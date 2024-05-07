import { createSlice } from "@reduxjs/toolkit";

export const broadSlice = createSlice({
    name: "broadSlice",
    initialState: {
        broad: {}
    },
    reducers: {
        setBroad: (state, { payload: broad }) => {
            state.broad = broad;
        },
        delBroad: (state) => {
            state.broad = {};
        }
    }
});

export const { setBroad, delBroad } = broadSlice.actions;
export default broadSlice.reducer;