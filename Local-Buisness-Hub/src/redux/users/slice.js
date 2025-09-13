import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading : false,
    error : null
};
const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        signInStart : (state)=>{
            state.loading = true;
        },
        signInSuccess : (state,action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure : (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        updateInStart : (state) =>{
            state.loading = true;
        },
        updateInSuccess : (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateInFailure : (state, action) =>{
            state.loading = false;
            state.error = action.payload;  
        },
        deleteInStart : (state)=>{
            state.loading = true;
        },
        deleteInSuccess : (state) =>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteInFailure : (state,action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        signOutStart : (state) => {
            state.loading = true;
        },
        signOutSuccess : (state,action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
        },
        signOutFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateInStart, 
    updateInSuccess, 
    updateInFailure, 
    deleteInStart, 
    deleteInSuccess,
    deleteInFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure 
} = userSlice.actions;

export default userSlice.reducer;