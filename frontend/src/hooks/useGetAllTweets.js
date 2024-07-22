import { useEffect } from "react";
import { TWEET_END_POINT } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";
import axios from "axios";

const useGetAllTweets = async (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweets)
    //fetch all tweets 
    const fetchAllTweets = async () => {
        try {
            const response = await axios.get(`${TWEET_END_POINT}/allTweets/${id}`, {
                withCredentials: true,
            });
            // console.log(response); // Assuming response.data.tweets contains the array of tweets 
            dispatch(getAllTweets(response?.data?.tweets));
        } catch (error) {
            console.log(error);
        }
    };

    //fetch tweets of only following users
    const fetchFollowingTweets = async () => {
        try {
            const response = await axios.get(`${TWEET_END_POINT}/followingTweets/${id}`, {
                withCredentials: true,
            });
            // console.log(response);// Assuming response.data.tweets contains the array of tweets

            dispatch(getAllTweets(response?.data?.tweets));
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
       
        if (isActive) {
            console.log(true);
            fetchAllTweets();
        } else {
            console.log(false);
            fetchFollowingTweets();
        }

    }, [refresh,isActive]);
};

export default useGetAllTweets;
