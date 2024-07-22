import React, { useEffect, useState } from 'react'
import logo from "../Assets/constants/unnamed.png"
import { useSelector, useDispatch } from 'react-redux';
import { IoSend } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { TWEET_END_POINT } from '../utils/constants';
import Tweet from './Tweet';
import toast from 'react-hot-toast';
import { getRefresh } from '../redux/tweetSlice';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';


const CommentsSection = () => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState("");
    const { user } = useSelector((store) => store.user);
    const { id } = useParams();
    const [tweet, setTweet] = useState(null);
    const [Comments, setComments] = useState([]);
    const { refresh } = useSelector((store) => store.tweets);
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${TWEET_END_POINT}/reply`, {
                description: description,
                id: user?._id,
                tweetId: id,
            }, {
                withCredentials: true,
            });
            console.log(response.data.message)
            toast.success(response.data.message);
            setDescription("");
            dispatch(getRefresh())

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const getTweet = async () => {
            try {
                const response = await axios.get(`${TWEET_END_POINT}/comments/${id}`, {
                    withCredentials: true,
                });
                console.log(response.data);
                if (response.data.success) {
                    setTweet(response.data.tweet);
                    setComments(response.data.tweetComments);
                }
                else {
                    setTweet(null);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getTweet();
    }, [id, refresh])
    console.log(tweet);
    return (
        <div className='sm:w-[50%] w-[100%] h-[100vh] relative border-right'>
            <div className='bookmark p-4 border-bottom flex items-center'>
                <Link to="/">
                    <button className="bg-transparent border-none focus:outline-none flex items-center">
                        <IoMdArrowRoundBack className="text-gray-500 h-6 w-6 hover:text-white" />
                    </button>
                </Link>
                <div className='ml-2'>
                    <h1 className='text-2xl font-bold'>Comment <span className='text-sm'>'s</span></h1>
                </div>
            </div>
            <div className='CommentContent sm:h-[100%] h-[86%] w-full overflow-y-auto'>
                {tweet ? (
                    <div>
                        <div>
                            <Tweet tweet={tweet} />
                        </div>
                        {/*Comments Section*/}
                        <div className='sm:m-4 m-2 bg-[#141414d9]'>
                            {Comments?.map((comment) => {
                                return (
                                    <div>
                                        {comment ? (<Tweet tweet={comment} key={comment?._id} />) : (null)}
                                    </div>
                                )
                            })}
                        </div>
                        <div className="postWritingSection p-4 mb-20 bg-transparent rounded-none border-bottom">
                            <div className='flex'>
                                <label htmlFor="media" className="mr-4">
                                    <img
                                        src={user?.profilePhoto === null || user?.profilePhoto === "" ? (logo) : (user?.profilePhoto)}
                                        alt="Upload Media"
                                        className="h-14 w-16 rounded-full"
                                    />
                                </label>
                                <textarea
                                    className="w-full h-24 p-2 border-none outline-none bg-transparent rounded-md resize-none placeholder:text-lg"
                                    placeholder="Post Reply"
                                    value={description}
                                    maxLength={280}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                                <div>

                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center space-x-2">
                                    <button onClick={submitHandler} className="capitalize bg-[#48adff] flex items-center font-bold text-white px-4 py-2 mx-3 rounded-full hover:bg-blue-600 transition duration-300">
                                        post
                                        <IoSend className='ml-2' />
                                    </button>
                                    {/* <FaRegImage className="text-2xl" /> */}
                                </div>
                                <div>
                                    <span className="text-gray-500">{description.length}/280</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (<p className="text-gray-500 text-center mt-[10%]" >Tweet not found!</p>)}
            </div>
        </div>
    )
}
export default CommentsSection;
