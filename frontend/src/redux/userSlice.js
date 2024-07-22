import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    profile:null,
    otherUsers:null,
    refresh:false,
    notifications:null,
  },
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    getProfile:(state,action)=>{
        state.profile = action.payload;
    },
    getOtherUsers:(state,action)=>{
        state.otherUsers = action.payload;
    },
    getUserRefresh:(state)=>{
      state.refresh = !state.refresh;
    },
    getBookmarked:(state,action)=>{
      if(state.user.bookmark.indexOf(action.payload) !== -1){
        state.user.bookmark =  state.user.bookmark.filter((item)=>item!==action.payload)
      }else{
        state.user.bookmark.push(action.payload);
      }
    },
    getNotifications:(state,action)=>{
      state.notifications = action.payload;
    },
    updateName(state,action){
      state.user.name = action.payload;
    },
    updateUsername(state,action){
      state.user.username = action.payload;
    },
    updateBio(state,action){
      state.user.bio = action.payload;
    },
    updateProfilePhoto(state, action){
      state.user.profilePhoto = action.payload;
    },
    updateCoverPhoto(state, action){
      state.user.coverPhoto = action.payload;
    }
  },
});
export const {getUser,getProfile,getOtherUsers,getUserRefresh,getBookmarked,updateName,updateUsername,updateBio,updateCoverPhoto,updateProfilePhoto,getNotifications} = userSlice.actions;
// actions and reducers are accessed from the slice;
export default userSlice.reducer;