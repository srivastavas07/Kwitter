import { SideBarContent } from '../Assets/constants/constant';
import React from 'react';
import twitterLogo from '../Assets/twitterLogo.png'
import { Link } from 'react-router-dom';
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { USER_END_POINT } from '../utils/constants';
import { getNotifications, getOtherUsers, getProfile, getUser } from '../redux/userSlice';
import { clearChat, getAllTweets, getFollowersTweet, getUserTweets } from '../redux/tweetSlice';
import logo from "../Assets/constants/unnamed.png"

const LeftSideBar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.user);

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${USER_END_POINT}/logOut`);
            toast.success(response.data.message);
            navigate("/login");
            dispatch(getUser(null));
            dispatch(getOtherUsers(null));
            dispatch(getProfile(null));
            dispatch(getAllTweets(null));
            dispatch(getFollowersTweet(null));
            dispatch(getUserTweets(null));
            dispatch(clearChat());
            dispatch(getNotifications(null));
        } catch (error) {
            console.log(error);
        }
    };

    const hoverColor = "bg-[#52525249]";
    const capiName = user?.name.charAt(0).toUpperCase() + user?.name.slice(1);
    return (
        <div className=" w-[25%] h-screen hidden sm:flex flex-col items-center justify-start border-right bg-[#00000] relative">
            <div className="p-4 mt-2 mb-4 w-[50%]">
                {/* twitter icon */}
                <img src={twitterLogo} style={{ height: '60px' }} alt="twitter-Clone" />
            </div>
            <div className="w-50%">
                <ul>
                    {SideBarContent().map((item, index) => (
                        <Link to={item.path} key={index}>
                            <li className={`relative px-5 mb-1 py-4 flex justify-start items-center text-white text-2xl hover:bg-[#52525249] rounded-full cursor-pointer`}>
                                {item.icon}
                                {item.hasNotifications && (
                                    <span className="absolute top-[14px] left-[38px] h-2 w-2 bg-[#05a3ff] rounded-full"></span>
                                )}
                                <span className="ml-3 font-normal text-xl tracking-wider">{item.label}</span>
                            </li>

                        </Link>

                    ))}
                </ul>
            </div>
            <div className={`py-4 px-8 rounded-full absolute bottom-10 hover:${hoverColor}`}>
                <div className='logout flex items-center relative'>
                    <img src={user?.profilePhoto === "" || user?.profilePhoto === null ? (logo) : (user?.profilePhoto)} className='h-11 w-11 rounded-full mr-2' alt="logout"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = logo;
                        }}
                    />
                    <div className='username'>
                        <span className='ml-2 block font-semibold'>{capiName}</span>
                        <span className="ml-2 text-[#ffffff85]">@{user?.username}</span>
                    </div>
                    <div className='options pl-4 cursor-pointer hover:text-blue-400' onClick={() => setShowLogout(!showLogout)}>
                        <SlOptionsVertical size={16} />
                    </div>
                    {showLogout && (
                        <div className='logout rounded-md border border-[#d1d1d15c] absolute p-1 py-4 top-[-180%] left-0 hover:bg-[#ffffff18] cursor-pointer'>
                            <button onClick={() => handleLogout()} className='font-semibold text-sm max-w-[200px] min-w-[200px]'>LogOut <span className='text-slate-100 text-md px-1 overflow-clip'> @{user?.username}</span></button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};


export default LeftSideBar;

