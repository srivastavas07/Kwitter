import axios from "axios";
import { TWEET_END_POINT } from "../utils/constants";
import { getUserTweets } from "../redux/tweetSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const useGetUserTweets = async(id) => {
    const {refresh} = useSelector(state => state.tweets);
    const dispatch = useDispatch();
    useEffect(() => {
    const fetchUserTweets = async() =>{
        try{
            const response = await axios.get(`${TWEET_END_POINT}/userTweets/${id}`,{
                withCredentials:true,
            });
            //without withCredentials request will be unauthorized.
            // its allows the browser to send the cookies to the server.
            dispatch(getUserTweets(response?.data));
            // console.log(response?.data);
        }catch(error){
            console.log(error);
        }
    }
        fetchUserTweets();
    },[refresh,id]);
}
export default useGetUserTweets;