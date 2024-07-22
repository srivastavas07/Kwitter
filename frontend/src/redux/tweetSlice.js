import { createSlice } from "@reduxjs/toolkit";
const tweetSlice = createSlice({
    name:"tweets",
    initialState:{
        allTweets:null,
        followersTweets:null,
        refresh:false,
        isActive:true,
        userTweets:null,
        bookmarkedTweets:null,
        botChat:[]
    },
    reducers:{
        getAllTweets:(state,action)=>{
            state.allTweets = action.payload;
        },
        getFollowersTweet:(state,action)=>{
            state.followersTweets = action.payload;
        },
        getRefresh:(state)=>{
            state.refresh = !state.refresh;
        },
        getIsActive:(state,action)=>{
            state.isActive = action.payload;
        },
        getUserTweets:(state,action)=>{
            state.userTweets = action.payload;
        },
        getBookmarkedTweets:(state,action)=>{
            state.bookmarkedTweets = action.payload;
        },
        addBotMessage:(state,action)=>{
            state.botChat.push(action.payload); // Just push the new message
        },
        clearChat:(state)=>{
            state.botChat = [];
        }
    }
})
export const {getAllTweets, getFollowersTweet, getRefresh,getIsActive, getUserTweets,getBookmarkedTweets,addBotMessage,clearChat} = tweetSlice.actions;
export default tweetSlice.reducer;