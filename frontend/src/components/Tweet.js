import React, { useEffect, useState } from 'react';
import { FaBookmark, FaRegComment, FaRegHeart, FaShare } from 'react-icons/fa';
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { TWEET_END_POINT, USER_END_POINT } from '../utils/constants';
import { toast } from "react-hot-toast";
import { getRefresh } from '../redux/tweetSlice';
import { MdDeleteForever } from "react-icons/md";
import { getBookmarked } from "../redux/userSlice";
import logo from "../Assets/constants/unnamed.png";
import LikedByUsers from "./LikedByUsers.js"
import { Link } from 'react-router-dom'
import ShareTweet from './ShareTweet.js';

const Tweet = ({ tweet }) => {
    const { user } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);
    const { refresh } = useSelector(store => store.tweets);
    const [sentiment, setSentiment] = useState("");
    const [showLikedUser, setShowLikedUser] = useState(false);
    const [allLikedUsers, setAllLikedUsers] = useState([]);
    const [showShare, setShowShare] = useState(false);
    const [sentimentLoading, setSentimentLoading] = useState(false);
    useEffect(() => {
        const fetchCurrentUserDetails = async () => {
            try {
                const response = await axios.get(`${USER_END_POINT}/profile/${tweet?.userId}`, {
                    withCredentials: true,
                });
                setUserDetails(response.data.user);
            } catch (error) {
                console.log(error);
            }
        };

        if (tweet?.userId) {
            fetchCurrentUserDetails();
        }
    }, [tweet?.userId, refresh]);

    const likedUserShow = async () => {

        try {
            const response = await axios.get(`${TWEET_END_POINT}/likedUsers/${tweet?._id}`, {
                withCredentials: true,
            })
            setAllLikedUsers(response.data);
        }
        catch (error) {
            console.log(error);
        }
        setShowLikedUser(true);

    }
    const likeDislikeHandler = async () => {
        try {
            const response = await axios.put(`${TWEET_END_POINT}/likeOrDislike/${tweet?._id}`, {
                id: user?._id
            }, {
                withCredentials: true
            })
            dispatch(getRefresh());
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const SentimentAnalyse = async () => {
        setSentiment("");
        setSentimentLoading(true);
        try {
            // Assuming tweet is guaranteed to be an object with description
            console.log(tweet.description);
            const response = await axios.get(`${TWEET_END_POINT}/analyseSentiment`, {
                params: {
                    tweet: tweet.description,
                },
                withCredentials: true,
            });
            setSentiment(response.data.text);
        } catch (error) {
            // Handle the error here, potentially with a user message or retry logic
            console.error("Error during sentiment analysis:", error);
        }
        setSentimentLoading(false);
    };


    const TweetDelete = async () => {
        try {
            const response = await axios.delete(`${TWEET_END_POINT}/delete/${tweet?._id}`, {
                withCredentials: true,
            })
            toast.success(response.data.message);
            dispatch(getRefresh());
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const TweetBookmark = async () => {
        try {
            const response = await axios.put(`${USER_END_POINT}/bookmark/${tweet?._id}`, {
                id: user?._id,
            }, {
                withCredentials: true,
            })
            dispatch(getBookmarked(tweet?._id));
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }
    }

    const capiName = userDetails?.name ? userDetails?.name.charAt(0).toUpperCase() + userDetails?.name.slice(1) : '';
    const timee = new Date(tweet?.createdAt);
    let Dtime = "";
    const dayOfMonth = timee.getDate();
    const month = timee.toLocaleString('default', { month: 'long' });
    const currentTime = new Date();

    if (currentTime.getDate() === timee.getDate()) {
        const amPm = timee.getHours() >= 12 ? 'pm' : 'am';
        const hour = (timee.getHours() % 12 || 12).toString().padStart(2, '0'); 
        const minutes = timee.getMinutes().toString().padStart(2, '0'); // Ensure two digits
        
            Dtime = `${hour}:${minutes} ${amPm}`;
        
    } else {
        Dtime = `${dayOfMonth} ${month}`;
    }

    return (
        <div className="relative bg-transparent rounded-none p-4 shadow-md px-6 border-bottom">
            {showShare ? (<ShareTweet setShowShare={setShowShare} userDetails={userDetails} tweet={tweet} />) : null}
            {/* Header */}
            <div className="flex sm:items-center">
                <img
                    src={userDetails?.profilePhoto === null || userDetails?.profilePhoto === "" ? (logo) : (userDetails?.profilePhoto)}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div className="sm:flex items-center gap-2 ">
                    <h2 className="font-semibold">{capiName || 'Loading...'}</h2>
                    <p className="text-gray-500 sm:text-base text-[14px]">@{userDetails?.username || 'Loading..'} <span className="sm:inline-block">. {Dtime} </span></p>
                </div>
            </div>
            {/* Content */}
            <p className="sm:mt-2 mt-4">
                {tweet?.description}
            </p>
            {showLikedUser ? (<LikedByUsers allLikedUsers={allLikedUsers} showLikedUser={showLikedUser} setShowLikedUser={setShowLikedUser} />
            ) : (null)}
            {/* Footer */}
            <div className="sm:flex justify-between items-center mt-4">
                <div className="flex items-center space-x-4 text-gray-500 mb-3 sm:mb-0">
                    <div className={` ${tweet?.like?.includes(user?._id) ? "text-red-500" : ""} flex items-center hover:underline hover:text-red-400`} title="Like">
                        <FaRegHeart onClick={likeDislikeHandler} className="tweetIcon  cursor-pointer" />
                        <span onClick={() => likedUserShow()} className="ml-1 cursor-pointer">{tweet?.like?.length}</span>
                    </div>
                    <Link to={`/comments/${tweet?._id}`}>
                        <div className="flex items-center hover:text-blue-400 hover:underline" title='Comment'>
                            <FaRegComment className="tweetIcon cursor-pointer" />
                            <span className="ml-1">{tweet?.comments?.length}</span>
                        </div>
                    </Link>
                    <div onClick={() => setShowShare(true)} className="flex items-center hover:text-purple-300" title='Share'>
                        <FaShare className="tweetIcon cursor-pointer" size={18} />
                        <span className="ml-1 text-xs cursor-pointer">Share</span>
                    </div>
                    <div onClick={TweetBookmark} className={`${user?.bookmark?.includes(tweet?._id) ? "text-green-500" : ""} flex items-center hover:text-green-400`} title='Bookmark'>
                        <FaBookmark className="tweetIcon  cursor-pointer" size={16} />
                    </div>
                </div>
                <div className='flex items-center text-sm'>
                    {sentimentLoading ? (<div className='little-loader'></div>) : null}
                    {sentiment ? (<p className='text-sm text-gray-400 mr-4'>Tweet is {sentiment}</p>) : null}
                    <button onClick={() => SentimentAnalyse()} className='flex text-blue-500 mr-2 items-center'><span title="Analyse Tweet Sentiment" className='mr-1'>Analyse Tweet</span><IoSearch className='text-white' /></button>
                    {user?._id === userDetails?._id ? (
                        <button onClick={TweetDelete} title="Delete Tweet" className="sm:relative absolute right-3 bottom-4 sm:right-0 sm:bottom-0 text-gray-300 hover:text-blue-500 cursor-pointer">
                            <MdDeleteForever size={23} />
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}


export default Tweet;
//    1.setAllLikedUsers(response.data);: This updates the state variable allLikedUsers with the data received from the API response (response.data). Each time this function runs, it sets allLikedUsers to the new fetched data.
//    2.useEffect Dependency Array ([showLikedUser]): This hook runs the likedUserShow function whenever showLikedUser state changes. It ensures that whenever the user clicks to show liked users (showLikedUser becomes true), the function fetches the data and updates the state accordingly.
//    3.Second useEffect Hook: This hook is used to log allLikedUsers to the console. It runs every time allLikedUsers changes, which means it logs the updated state variable each time setAllLikedUsers is called with new data.
