import React, { useEffect, useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { setProperty } from '../redux/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { USER_END_POINT } from '../utils/constants';
import {toast} from "react-hot-toast";
import { getRefresh } from '../redux/tweetSlice';
import {updateUsername,updateName,updateBio,updateProfilePhoto,updateCoverPhoto} from "../redux/userSlice";
import logo from "../Assets/constants/unnamed.png"
import cover from "../Assets/constants/cover.png"

const EditProfile = () => {
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [name, setName] = useState(user?.name);
    const [username, setUsername] = useState(user?.username);
    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [bio,setBio] = useState(user?.bio); 
    const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto);
    const [coverPhoto, setCoverPhoto] = useState(user?.coverPhoto);
    const profilePic = user?.profilePhoto ? (user?.profilePhoto) : (logo);

    const submitHandler = async(e) => {
        e.preventDefault();
        //handle form submission here...
        try{
            const response = await axios.put(`${USER_END_POINT}/edit/${user?._id}`,{
                name:name,
                username:username,
                email:email,
                password:password,
                bio:bio,
                confirmPassword:confirmPass,
                profilePhoto:profilePhoto,
                coverPhoto:coverPhoto
            },{
                header:{
                    'Content-Type': 'application/json',
                },
                withCredentials:true,
            });
            dispatch(getRefresh());
            dispatch(updateName(name))
            dispatch(updateUsername(username));
            dispatch(updateBio(bio));
            dispatch(updateProfilePhoto(profilePhoto));
            dispatch(updateCoverPhoto(coverPhoto));
            dispatch(setProperty(false));
            toast.success(response.data.message);
        }catch(error){
            console.log(error);
            toast.error(error.response.data.message);
        }

    };

    return (
        <div className='flex fixed items-center justify-center w-[100vw] min-h-screen z-[1] backdrop-blur-[4px]'>
            <div className='absolute w-full h-full bg-[#5c5c5c86] z-[2]'></div>
            <div className='sm:p-9 p-3 sm:w-[55%] w-[98%] bg-black z-10 relative rounded-lg'>
                <div className='overflow-y-auto max-h-[80vh] scroll'>
                <button onClick={() => dispatch(setProperty(false))} className='absolute top-4 right-4 sm:bg-transparent bg-black z-[3] rounded-sm'><RxCross2 size={20} /></button>
                <div
                    className="bg-gray-300 h-52 rounded-none relative mb-20"
                    style={{
                        backgroundImage: user?.coverPhoto ? `url(${user?.coverPhoto})` : `url(${cover})`,
                        backgroundSize: 'cover'
                      }}
                >
                    <div className="absolute bottom-0 left-4 transfrom translate-y-1/2">
                        <img
                            src={profilePic}
                            alt="Profile Photo"
                            className=" sm:w-36 sm:h-36 h-32 w-32 rounded-full border-4 border-black"
                        />
                    </div>

                </div>
                <form className='my-4 sm:text-base text-sm' onSubmit={submitHandler}>
                    <div className='mb-4'>
                        <label htmlFor='name' className='block text-sm font-bold mb-3 text-white'>Name</label>
                        <input
                            required
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id='name'
                            name='name'
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='username' className='block text-sm font-bold mb-3 text-white'>Username</label>
                        <input
                            required
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id='username'
                            name='username'
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='bio' className='block text-sm font-bold mb-3 text-white'>Bio</label>
                        <input
                            required
                            type='text'
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            id='bio'
                            name='bio'
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='bio' className='block text-sm font-bold mb-3 text-white'>Dp link</label>
                        <input
                            required
                            type='text'
                            value={profilePhoto}
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            id='profilePhoto'
                            name='profilePhoto'
                            title="link for profile pic"
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='cover' className='block text-sm font-bold mb-3 text-white'>Cover Photo Link</label>
                        <input
                            required
                            type='text'
                            value={coverPhoto}
                            onChange={(e) => setCoverPhoto(e.target.value)}
                            id='coverPhoto'
                            name='coverPhoto'
                            title="link for cover photo"
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-sm font-bold mb-3 text-white'>Email</label>
                        <input
                            required
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id='email'
                            name='email'
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-bold mb-3 text-white'>Password</label>
                        <input
                            required
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id='password'
                            name='password'
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-bold mb-3 text-white'>Confirm Password</label>
                        <input
                            required
                            type='password'
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            id='ConfirmPassword'
                            name='password'
                            className='w-full bg-transparent text-white border-b border-white outline-none rounded-none'
                        />
                    </div>
                    <button
                        onClick={submitHandler}
                        type='submit'
                        className='bg-transparent text-[#5f9bfa] border border-white w-[60%] hover:bg-slate-800 font-bold py-2 my-2 px-4 rounded-full'
                    >
                        Save Edit
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default EditProfile;
