import React from 'react'
import Tweet from "./Tweet.js"
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_END_POINT } from '../utils/constants.js';
import { getBookmarkedTweets } from '../redux/tweetSlice.js';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';

function BookmarkSection() {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.user);
    const { refresh, bookmarkedTweets } = useSelector(store => store.tweets);
    const fetchBookmarkedTweets = async () => {
        try {
            const response = await axios.get(`${USER_END_POINT}/bookmarkedTweets/${user?._id}`, {
                withCredentials: true,
            });
            console.log(response.data);
            dispatch(getBookmarkedTweets(response?.data?.tweets));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBookmarkedTweets();
    }, [refresh]);


    return (

        <div className='sm:w-[50%] w-[100%] relative border-right'>
            <div className='h-full'>
                <div className='bookmark p-4 border-bottom flex items-center'>
                    <Link to="/">
                        <button className="bg-transparent border-none focus:outline-none">
                            <IoMdArrowRoundBack className="text-gray-500 h-6 w-6 hover:text-white" />
                        </button>
                    </Link>
                    <div className='ml-2'>
                        <h1 className='text-2xl font-bold'>Bookmark <span className='text-sm'>'s</span></h1><p className=' text-gray-500 text-sm'>@{user?.name}</p>
                    </div>
                </div>
                {/* Tweet components */}
                <div className=' overflow-y-auto sm:max-h-[90vh] max-h-[83vh] pb-4'>
                    {
                        bookmarkedTweets?.slice().filter(tweet => tweet && tweet.createdAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((tweet, index) => {
                            return (
                                tweet?.description ? <Tweet className="relative" key={index} tweet={tweet} /> : null
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default BookmarkSection