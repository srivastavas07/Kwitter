import { useEffect } from "react";
import { TWEET_END_POINT } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets } from "../redux/tweetSlice";
import axios from "axios";

const useGetAllTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweets);

    useEffect(() => {
        //fetch all tweets
        const fetchAllTweets = async () => {
            try {
                const response = await axios.get(`${TWEET_END_POINT}/allTweets/${id}`, {
                    withCredentials: true,
                });
                dispatch(getAllTweets(response?.data?.tweets));
            } catch (error) {
                console.log(error);
            }
        };
        //fetch only the tweets of the user's followings
        const fetchFollowingTweets = async () => {
            try {
                const response = await axios.get(`${TWEET_END_POINT}/followingTweets/${id}`, {
                    withCredentials: true,
                });
                dispatch(getAllTweets(response?.data?.tweets));
            } catch (error) {
                console.log(error);
            }
        };

        if (isActive) {
            fetchAllTweets();
        } else {
            fetchFollowingTweets();
        }
    }, [dispatch, id, refresh, isActive]);
};

export default useGetAllTweets;
