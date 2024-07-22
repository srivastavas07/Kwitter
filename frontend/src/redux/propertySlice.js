import { createSlice } from "@reduxjs/toolkit";
const propertySlice = createSlice({
    name:"properties",
    initialState:{
        edit:false,
        searchArea:false,
    },
    reducers:{
        setProperty:(state,action)=>{
            state.edit = action.payload;
        },
        setSearchArea:(state,action)=>{
            state.searchArea = !state.searchArea;
        }
    }
})
export const {setProperty,setSearchArea} = propertySlice.actions;
export default propertySlice.reducer;