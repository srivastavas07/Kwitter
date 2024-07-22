import { SideBarContent } from '../Assets/constants/constantmobile.js';
import React, { useEffect } from 'react';
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

const BottomBar = () => {
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

  return (
    <div className="sm:hidden fixed bottom-0 left-0 w-full bg-black flex justify-around items-center py-0 border-t border-gray-700">
      {SideBarContent().map((item, index) => (
        <Link to={item.path} key={index} className='relative'>
          {item.hasNotifications && (
              <span className="absolute top-2 left-[27px] h-[7px] w-[7px] bg-[#05a3ff] rounded-full"></span>
            )}
          <div className="flex relative justify-center items-center h-[100%] text-white hover:bg-[#62626249] p-3 rounded-full">
            {React.cloneElement(item.icon, { size: item.size })}
          </div>
        </Link>
      ))}
      <div className="flex justify-center items-center text-white hover:bg-[#52525249] p-2 rounded-full relative">
        <img src={user?.profilePhoto === "" || user?.profilePhoto === null ? (logo) : (user?.profilePhoto)} className="h-8 w-8 rounded-full" alt="logout" />
        <SlOptionsVertical size={18} className="cursor-pointer" onClick={() => setShowLogout(!showLogout)} />
        {showLogout && (
          <div className="absolute bottom-14 right-[0px] bg-black border border-gray-700 rounded-sm p-2">
            <button onClick={() => handleLogout()} className='font-semibold text-sm max-w-[200px] min-w-[200px]'>LogOut <span className='text-slate-100 text-md px-1 overflow-clip'> @{user?.username}</span></button>

          </div>
        )}
      </div>
    </div>
  );
};


export default BottomBar;

