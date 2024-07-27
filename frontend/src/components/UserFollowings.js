import React from 'react';
import ReactDOM from 'react-dom';
import { RxCross2 } from "react-icons/rx";
import logo from "../Assets/constants/unnamed.png";
import { Link } from 'react-router-dom';

const UserFollowings = ({ followings, setShowFollowings }) => {
    return ReactDOM.createPortal(
        <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[2px]'>
            <div className='relative p-3 bg-black border border-white rounded-lg sm:w-[40%] w-[85%]'>
                <button onClick={() => setShowFollowings(false)} className='absolute top-[8px] right-[8px]'>
                    <RxCross2 size={15} />
                </button>
                <p className='text-xs font-semibold text-slate-400 mb-1'>Following..</p>
                {followings.length === 0 ? (<div className='text-sm text-slate-400 py-4 text-center'>No followings or User Deleted</div>) : null}
                <div className="p-1 max-h-[50vh] overflow-y-auto scroll">
                    {followings.map((user, index) => {
                        const capiName = user?.name ? user?.name.charAt(0).toUpperCase() + user?.name.slice(1) : 'User not Found';
                        const username = user?.username ? user?.username : "Deleted User";
                        return (
                            <div key={index} className='flex items-center space-x-4 py-3'>
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default UserFollowings;

