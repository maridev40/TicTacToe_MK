import {configureStore} from "@reduxjs/toolkit"
import broadSlice from "../reducers/broadSlice";
import userSlice from "../reducers/userSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        broad: broadSlice
    }
});

export default store;