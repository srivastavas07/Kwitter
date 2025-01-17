import React from 'react'
import { useSelector } from 'react-redux'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { USER_END_POINT } from '../utils/constants';
import axios from 'axios';
import { getNotifications } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { FaBell } from 'react-icons/fa';
import logo from "../Assets/constants/unnamed.png"

const NotificationSection = () => {
    const origin = window.location.origin;
    const { user, notifications } = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const get_Notifications = async () => {
        try {
            const response = await axios.get(`${USER_END_POINT}/notifications/${user?._id}`, {
                withCredentials: true,
            })
            console.log(response.data.notifications);
            dispatch(getNotifications(response.data.notifications))
        } catch (error) {
            console.log(error);
        }
    }
    console.log(notifications);
    return (
        <div className='sm:w-[50%] w-[100%] relative h-[100vh] border-right'>
            <div className='p-4 border-bottom flex items-center'>
                <Link to="/">
                    <button className="bg-transparent border-none focus:outline-none">
                        <IoMdArrowRoundBack className="text-gray-500 h-6 w-6 hover:text-white" />
                    </button>
                </Link>
                <div className='flex justify-between w-[100%] items-center'>
                    <div className='ml-2'>
                        <h1 className='text-2xl font-bold'>Notifications</h1><p className=' text-gray-500 text-sm'>@{user?.name}</p>
                    </div>
                    <button title="Get Notifications" onClick={get_Notifications} className=' bg-blue-600 text-white p-3 text-sm flex items-center'>Get <FaBell className="ml-1" size={16} /></button>
                </div>
            </div>
            <div className='p-4 overflow-y-auto sm:max-h-[90vh] max-h-[95.5vh] scroll'>
                {notifications?.length === 0 ? (

                    <p className='text-gray-600 my-[10%] text-center'>No Notifications</p>
                ) :
                    notifications?.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notification) => {
                        const targetLink = `${origin}${notification.targetTweetLink}`
                        return (
                            <Link to={targetLink}>
                                <div key={notification?._id} className='p-4 mb-4 bg-gray-900 rounded-lg shadow-md flex items-center'>
                                    <img src={notification?.actorProfilePhoto || logo} className='mr-4' style={{
                                        height: "40px",
                                        width:"40px",
                                        borderRadius: "50%"
                                    }} alt="userPic"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = logo;
                                        }}
                                    />
                                    <div>
                                        <p className='text-gray-300'>{notification.description}</p>
                                        <p className='text-gray-500 text-xs'>{moment(notification.createdAt).fromNow()}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                    )}
                {/* Add more notification items as needed */}
            </div>
        </div>
    )
}

export default NotificationSection;