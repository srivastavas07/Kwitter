import React, { useEffect } from 'react';
import { MdOutlineFeedback } from "react-icons/md";
import Tweet from "./Tweet.js"
import { IoSend } from "react-icons/io5";
import {useState} from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { TWEET_END_POINT } from '../utils/constants.js';
import { getRefresh,getIsActive } from '../redux/tweetSlice.js';
import {toast} from "react-hot-toast";
import useGetAllTweets from "../hooks/useGetAllTweets.js";
import logo from "../Assets/constants/unnamed.png"
import Feedback from './Feedback.js';

const TweetSection = () => {
  const {allTweets} = useSelector(store=>store.tweets);
  const {user} = useSelector((store)=>store.user);
  useGetAllTweets(user?._id);
  const [description, setDescription] = useState("");
  const {isActive} = useSelector(store=>store.tweets);
  const dispatch = useDispatch();
  const [feedback,setFeedback] = useState(false);

  useEffect(()=>{
    if (description.length === 280 ){
      toast.error("280 characters allowed only");
    }
  },[description])
  const submitHandler = async(e)=>{
    e.preventDefault();
    try{
      const response = await axios.post(`${TWEET_END_POINT}/create`,{description,id:user?._id},{
        withCredentials:true,
      });
      toast.success(response.data.message);
      dispatch(getRefresh());
    }catch(error){
      console.log(error);
      toast.error(error.response.data.message);
    }
    setDescription("");
  }
  const TweetSectionHandler = (value)=>{
    dispatch(getIsActive(value));
  }
  return (
    <div className='h-full'>
      {feedback ? <Feedback setFeedback = {setFeedback}/> : null}
      <div className='feedTop relative flex justify-around top-0 w-full p-y pt-6 h-16  border-bottom'>
        <div onClick={()=>TweetSectionHandler(true)} className='relative h-full w-20'>
          <h1 className={`${isActive?"font-semibold":"text-gray-400"} feedToggle text-center cursor-pointer`}>For you</h1>
          <span  className={`${isActive?"active":""}`}></span>
        </div>
        <div onClick={()=>TweetSectionHandler(false)} className='relative h-full w-20'>
          <h1 className={`${!isActive?"font-semibold":"text-gray-400"} feedToggle relative text-center cursor-pointer`}>Followed</h1>
          <span className={`${!isActive?"active":""}`}></span>
        </div>
        <div className='absolute sm:right-8 right-4 sm:pt-0 pt-[1px]' onClick={()=>setFeedback(true)} title="Feedback!">
          <MdOutlineFeedback className='sm:text-2xl text-[25px]' />
        </div>
      </div>

      <div className='overflow-y-auto sm:max-h-[90vh] max-h-[83.5vh] scroll'>
        {/* Post Writing Section */}
        <div className="postWritingSection p-4 bg-transparent rounded-none border-bottom">
          <div className='flex'>
            <label htmlFor="media" className="mr-4">
              <img
                src={user?.profilePhoto === null || user?.profilePhoto === "" ? (logo) : (user?.profilePhoto)}
                alt="Upload Media"
                className="h-14 w-16 rounded-full"
              />
            </label>
            <textarea
              className="w-full h-24 p-2 border-none outline-none bg-transparent rounded-md resize-none placeholder:text-xl"
              placeholder="What's on your mind?!"
              value={description}
              maxLength={280}
              onChange={(e)=>setDescription(e.target.value)}
            ></textarea>
            <div>

            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <button onClick = {submitHandler} className="capitalize bg-[#48adff] flex items-center font-bold text-white px-4 py-2 mx-3 rounded-full hover:bg-blue-600 transition duration-300">
                post 
                <IoSend className='ml-2'/>
              </button>
              {/* <FaRegImage className="text-2xl" /> */}
            </div>
            <div>
              <span className="text-gray-500">{description.length}/280</span>
            </div>
          </div>
        </div>
        {/* Tweet components */}
        {
          allTweets?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((tweet,index)=>{
            return (
              <Tweet key={index} tweet={tweet}/>
            )
          })
        }
      </div>
     
    </div>
  )
}

export default TweetSection