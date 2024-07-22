import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { FaTrademark } from "react-icons/fa";
import { useSelector } from 'react-redux';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { Link } from 'react-router-dom';
import logo from "../Assets/constants/unnamed.png"
import { USER_END_POINT } from '../utils/constants';
import axios from 'axios';
import { RxCross2 } from 'react-icons/rx';

function RightSideBar() {
  const { user, otherUsers } = useSelector(store => store.user);
  const {searchArea} = useSelector(store=>store.properties)
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  useGetOtherUsers(user?._id);
  const handleChange = (e) => {
    setSearchValue(e.target.value);
  }
  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const response = await axios.post(`${USER_END_POINT}/searchUser`, {
          searchValue: searchValue
        }, {
          withCredentials: true
        });
        setSearchResult(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };

    if (searchValue.length > 0 && searchValue !== 0) {
      fetchSearch();
    }

  }, [searchValue]);

  return (
    <div className={`sm:w-[25%] w-[100%] ${searchArea ? "block" : "sm:block hidden"}`}>
      {/* Search Bar */}
      <div className="mt-2 px-4 relative bg-gray-900 w-[90%] rounded-full mb-4 mx-auto flex items-center">
        {/* Your search bar content here */}
        <IoSearch />
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => handleChange(e)}
          value={searchValue}
          className="w-full py-2 px-4 bg-transparent outline-none"
        />
        { searchValue.length > 0 ? <RxCross2 className='absolute right-3 cursor-pointer bg-gray-900' size = {16} onClick={()=>setSearchValue("")} /> : null}
      </div>

      {/* Who to Follow */}
      <div className="relative py-4 pb-6 bg-gray-900 rounded-3xl w-[90%] mx-auto">
        <h2 className="text-lg font-semibold mb-4 px-4">Who to Follow</h2>
        <div className=' overflow-y-auto max-h-[70vh] scroll'>
          {/* mapping of the other Users will be done here... */}
          {otherUsers?.map((otherUser) => (
            <FollowCard key={otherUser._id} otherUser={otherUser} />
          ))}

        </div>
        {searchValue.length !== 0 ? (<SearchResult searchResult={searchResult} />
        ) : (null)}
      </div>
      {/* terms and condition */}
      <div className='terms w-[90%] mx-auto text-gray-500 my-4 text-sm'>
        <p className='flex items-center'>Developed with <span className=' text-red-500 mx-1'><FaHeart /></span> <a className='' href='https://github.com/srivastavas07'>by <span className='font-bold text-gray-300'>Kunal Chandra</span></a><FaTrademark className='mx-1 text-blue-400' /> </p>
      </div>
    </div>
  );
}
function FollowCard({ otherUser }) {
  const capiName = otherUser.name.charAt(0).toUpperCase() + otherUser.name.slice(1);
  return (
    <div className="flex items-center justify-between hover:bg-[#f4f4f407]">

      <div className='flex items-center space-x-4 px-4 py-3'>
        <Link to={`profile/${otherUser._id}`}>
          <img src={otherUser?.profilePhoto === "" || otherUser?.profilePhoto === null ? (logo) : (otherUser?.profilePhoto)} alt="User" className="w-10 h-10 rounded-full" />
        </Link>
        <div className="flex-1">
          <Link to={`profile/${otherUser._id}`}>
            <h3 className="font-semibold hover:underline">{capiName}</h3>
          </Link>
          <p className="text-gray-500 text-sm mt-[2px]">@{otherUser.username}</p>
        </div>

      </div>

      <Link to={`profile/${otherUser._id}`}>
        <button className='bg-white text-black rounded-3xl border border-black font-bold px-4 text-sm py-[6px] mr-4'>Profile</button>
      </Link>


    </div>
  )
}
const SearchResult = ({ searchResult }) => {
  return (
    <div className='searchResult absolute h-full overflow-y-auto scroll w-full bg-black rounded-md right-0 top-0'>
      {searchResult.map((user, index) => {
                        const capiName = user?.name ? user?.name.charAt(0).toUpperCase() + user?.name.slice(1) : 'User not Found';
                        const username = user?.username ? user?.username : "Deleted User";
                        return (
                            <div key={index} className='flex items-center space-x-4 py-3 px-2 hover:bg-[#52525249]'>
                                <Link to={`/profile/${user?._id}`}>
                                    <img src={user?.profilePhoto === "" || user?.profilePhoto === null || user === null ? (logo) : (user?.profilePhoto)} alt="User" className="w-10 h-10 rounded-full" />
                                </Link>
                                {/*
                                The issue you're encountering is due to how relative paths are resolved when using <Link> 
                                in React Router. When you use <Link to={profile/${user?._id}}>, React Router treats it as a 
                                relative path to the current URL. To ensure that the link resolves correctly to an absolute path 
                                from the root of your application, you should prepend a / to the path you pass to the to prop of <Link>.
                                 By adding a / at the beginning of the to prop value, React Router will navigate to 
                                 the profile/:userId route from the root of your application (http://localhost:3000), 
                                 rather than treating it as a relative path from the current URL 
                                 (http://localhost:3000/profile/663df2dd419dc9ff9b30ebf3). */}

                                <div className="flex-1">
                                    <Link to={`/profile/${user?._id}`}>
                                        <h3 className="font-semibold hover:underline">{capiName}</h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm mt-[2px]">@{username}</p>
                                    <p className='text-gray-500 text-sm mt-[2px]'>{user.email}</p>
                                </div>
                            </div>
                        );
                    })}
    </div>
  )
}

export default RightSideBar;
