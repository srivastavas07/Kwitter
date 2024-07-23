import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegCalendarAlt } from 'react-icons/fa';
import Tweet from './Tweet';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import useGetProfile from '../hooks/useGetProfile';
import { USER_END_POINT } from '../utils/constants';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getUserRefresh, getUser } from '../redux/userSlice';
import useGetUserTweets from '../hooks/useGetUserTweets';
import { setProperty } from '../redux/propertySlice'
import logo from "../Assets/constants/unnamed.png"
import cover from "../Assets/constants/cover.png"
import UserFollowers from './UserFollowers.js';
import UserFollowings from './UserFollowings.js'

const Profile = () => {

    const { profile } = useSelector(store => store.user);
    const { user } = useSelector(store => store.user);
    const [edit, setEdit] = useState(false);
    const { userTweets } = useSelector(store => store.tweets)
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowings, setShowFollowings] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    const { id } = useParams();

    useGetProfile(id);
    useGetUserTweets(id);

    useEffect(() => {
        if (profile?._id == user?._id) {
            setEdit(true);
        } else {
            setEdit(false);
        }
    }, [profile, user]);

    const dispatch = useDispatch();
    const FollowUnfollow = async (targetUserId, currentUser) => {
        try {
            const response = await axios.put(`${USER_END_POINT}/follow/${targetUserId}`, {
                id: currentUser,
            }, {
                withCredentials: true,
            })
            const userData = await axios.get(`${USER_END_POINT}/profile/${user?._id}`, {
                withCredentials: true,
            })
            dispatch(getUserRefresh());
            dispatch(getUser(userData?.data?.user));
            toast.success(response.data.message);

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    const ShowFollowers = async () => {
        try {
            const response = await axios.get(`${USER_END_POINT}/followers/${profile?._id}`, {
                withCredentials: true,
            });
            setFollowers(response.data.followers);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
        setShowFollowers(true);
    }
    const ShowFollowing = async () => {
        try {
            const response = await axios.get(`${USER_END_POINT}/following/${profile?._id}`, {
                withCredentials: true,
            });
            setFollowings(response?.data?.following);

            //here its following not followings in the response.. need to be more carefull with the name conventions

            console.log(response);
        } catch (error) {
            console.log(error);
        }
        setShowFollowings(true);
    }
    const editClicked = async () => {
        dispatch(setProperty(true));
    }
    const capiName = profile?.name.charAt(0).toUpperCase() + profile?.name.slice(1);

    // Parse the date string into a Date object

    const dateObject = new Date(profile?.createdAt);
    const formattedDate = dateObject.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="bg-transparent rounded-none sm:w-[50%] w-[100%] py-4 shadow-md overflow-y-auto sm:max-h-[100vh] max-h-[95.5vh] scroll border-right">
            <div className="flex items-center mb-3 px-4">
                <Link to="/">
                    <button className="bg-transparent border-none focus:outline-none">
                        <IoMdArrowRoundBack className="text-gray-500 h-6 w-6 hover:text-white" />
                    </button>
                </Link>
                <div className='ml-2'>
                    <h1 className="font-bold text-xl">{capiName}</h1>
                    <h3 className=' text-gray-500'>{userTweets?.tweets?.length} posts</h3>
                </div>

            </div>
            {/* Profile Header */}
            <div className=" mb-20 p-1">
                {/* Banner */}
                <div
                    className="bg-gray-300 h-52 rounded-none relative"
                    style={{ backgroundImage: profile?.coverPhoto ? (`url("${profile?.coverPhoto}")`) : (`url(${cover})`), backgroundSize: 'cover' }}
                >
                    <div className="absolute bottom-0 left-4 transfrom translate-y-1/2">
                        <img
                            src={profile?.profilePhoto === "" || profile?.profilePhoto === null ? (logo) : (profile?.profilePhoto)}
                            alt="Profile Photo"
                            className=" w-36 h-36 rounded-full border-4 border-black"
                        />
                    </div>
                    <div>
                        {/* edit profile button */}
                        <div className="absolute bottom-4 right-4 transform translate-y-20">
                            {edit ?
                                (
                                    <button onClick={() => editClicked()} className="bg-transparent border border-white rounded-3xl text-white px-4 py-2 hover:bg-[#ffffff1e] transition duration-300">
                                        Edit Profile
                                    </button>
                                ) :
                                (
                                    <button onClick={() => FollowUnfollow(profile?._id, user?._id)}
                                        className="bg-transparent border border-white rounded-3xl text-white px-4 py-2 hover:bg-[#ffffff1e] transition duration-300">
                                        {user?.following.includes(profile?._id) ? "Unfollow" : "Follow"}

                                    </button>
                                )}

                        </div>
                    </div>
                </div>
            </div>
            {
                showFollowers ? (<UserFollowers followers={followers} setShowFollowers={setShowFollowers} />) : null
            }
            {
                showFollowings ? (<UserFollowings followings={followings} setShowFollowings={setShowFollowings} />) : null
            }

            {/* Profile Stats */}

            <h2 className="font-bold px-6 mt-4 text-xl">{capiName}</h2>
            <p className="px-6 text-gray-500">@{profile?.username}</p>
            <p className='bio px-6 my-3'>{profile?.bio}</p>
            <div className="my-3 px-6">
                <div className='flex items-center text-slate-500 pb-3 mr-0'>
                    <FaRegCalendarAlt />
                    <p className='pl-1'> Joined {formattedDate}</p>
                </div>
                <div>
                    <div className='followList flex items-center mt-1'>
                        <p onClick={() => ShowFollowing()} className='pr-6 text-sm text-slate-500 hover:underline hover:text-slate-300 cursor-pointer '><span className='font-bold text-white'>{profile?.following?.length}</span> <span className='text-md'>Following</span></p>
                        <p onClick={() => ShowFollowers()} className='pr-6 text-sm text-slate-500 hover:underline  hover:text-slate-300 cursor-pointer'><span className='font-bold text-white'>{profile?.followers?.length}</span> <span className='text-md'>Followers</span></p>
                    </div>
                </div>
            </div>

            {/* Profile Tweet Section */}

            <div className='border-top'>
                <p className='pl-6 py-3 font-bold text-lg text-white'>Posts</p>
                {userTweets?.tweets?.length > 0 ? userTweets?.tweets?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(tweet => <Tweet key={tweet._id} tweet={tweet} />) : <div className='text-gray-500 text-center py-3'>No tweets to display</div>}
            </div>
        </div>
    );
}
// slice basically creates a image of the original array and leaves the origianal array unchanged..
export default Profile;
