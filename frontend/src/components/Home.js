import React, { useEffect } from 'react'
import LeftSideBar from './LeftSideBar.js'
import RightSideBar from './RightSideBar.js'
import { Outlet } from 'react-router-dom';
import EditProfile from './EditProfile.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useGetNotifications from '../hooks/useGetNotifications.js';
import BottomBar from './BottomBar.js';

const Home = () => {
  const navigate = useNavigate();
  const {edit,searchArea} = useSelector(store=>store.properties);
  const {user} = useSelector(store=>store.user);
  useGetNotifications();
  useEffect(()=>{
    if(!user){
      navigate("/login");
    }
  },[user,navigate])
  return (
    <div className='relative'>
    {edit?<EditProfile/>:("")}
    <div className='w-[100vw] flex'>
        <LeftSideBar/>
        {searchArea ? null :  <Outlet/> }
        <RightSideBar/>
        <BottomBar/>
    </div>
    </div>
  )
}

export default Home;