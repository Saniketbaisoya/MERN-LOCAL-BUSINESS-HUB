import {configureStore} from '@reduxjs/toolkit'
import userReducer from './users/slice.js'
export const store = configureStore({
    reducer : {
        user: userReducer
    },
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware({
        serializableCheck : false,
    }),
});