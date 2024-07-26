import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaTrademark } from 'react-icons/fa';
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa6";
import { useState } from 'react';
import { USER_END_POINT } from "../utils/constants.js";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUser } from '../redux/userSlice.js';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from "jwt-decode";

const Login = () => {
    const dispatch = useDispatch();
    const [account, setAccount] = useState(true);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (account) {
            //login
            //the mistake i was making here was not writing the code within the try and catch block. for the login part.
            try {
                const res = await axios.post(`${USER_END_POINT}/login`, {
                    email,
                    password
                }, {
                    header: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                })
                dispatch(getUser(res?.data?.user));
                if (res?.data?.success) {
                    navigate("/");
                    toast.success(res?.data?.message);
                }

            } catch (error) {
                toast.error(error.response?.data?.message);
            } finally {
                setLoading(false);
            }
        } else {
            //signup
            setLoading(true);
            try {
                const res = await axios.post(`${USER_END_POINT}/register`, {
                    name,
                    username,
                    email,
                    password
                }, {
                    header: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                })
                if (res.data.success) {
                    setAccount(true);
                    toast.success(res.data.message);
                }
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        }
    }
    const handleGoogleSuccess = async (response) => {
        const result = jwtDecode(response.credential);
        setLoading(true)
        try{
            const response = await axios.post(`${USER_END_POINT}/googlelogin`, {
                name: result.name,
                username: result.given_name + "07",
                email: result.email,
                profilePhoto: result.picture
            },{
                header: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            })
            dispatch(getUser(response?.data?.user));
            if(response?.data?.success){
                navigate("/");
                toast.success(response?.data?.message);
            };

        }catch(error){
            console.log(error);
        }
        setLoading(false)
    }
    const handleGoogleFailure = async (response) => {
        toast.error("Google Login was unsuccessfull.")
    }

    return (
            <section className='h-screen w-screen bg-black text-white flex justify-center items-center'>
                {loading ? (<div className='loading h-full w-full flex justify-center items-center'><span className='loader mr-2'></span><span className='text-[#28a9ff]'>Loading..</span></div>) : (<div className='p-0 sm:p-8 bg-transparent rounded-none shadow-lg flex items-center h-[80%] w-[80%]'>
                    <div className='w-1/2 sm:flex justify-between items-center text-white hidden'>
                        {/* Twitter logo */}
                        <svg viewBox="0 0 24 24" aria-hidden="true" width="400" height="400">
                            <g>
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#fff"></path>
                            </g>
                        </svg>
                    </div>

                    <div className='w-[100%] sm:w-1/2'>
                        <div className='text-left sm:h-full h-[90vh] overflow-y-auto'>
                            <h2 className='text-4xl font-bold mb-6 poppins'>Happening now</h2>
                            <p className='text-lg font-bold mb-4 poppins'>{account ? "Login here" : "Join today!"}</p>
                            {/* Google sign up button */}

                            <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    cookiePolicy={'single_host_origin'}
                                    onFailure={handleGoogleFailure}
                                    width={40}
                                    theme={'filled_black'}
                                    shape='rectangular'
                                    type={'standard'}
                            />
                            {/* add both http://localhost and http://localhost:3000 under URI else it wont work. */}

                            {/* What is render?
                                    The render prop is a way to customize how the Google Sign-In button looks and behaves. 
                                    Instead of using a default button provided by the library, you can create your own button
                                     with custom styling and behavior.

                                    How render Works
                                    renderProps: This is an object provided by the GoogleLogin component. 
                                    It contains properties and functions that help control the custom button's behavior.
                                    The most important ones are:
                                    renderProps.onClick: This function handles the button click. When the button is clicked, it triggers the Google Sign-In process.
                                    renderProps.disabled: This is a boolean value (true or false) that tells if the button should be disabled (unclickable) or not.
                                    Custom Button: Inside the render prop, you create your own button. */}
                            {account ? <Account name={name} email={email} username={username} password={password} setPassword={setPassword} setUsername={setUsername} setEmail={setEmail} setName={setName} submitHandler={submitHandler} /> : <CreateAccount name={name} email={email} username={username} password={password} setPassword={setPassword} setUsername={setUsername} setEmail={setEmail} setName={setName} submitHandler={submitHandler} />}

                            <div className='terms mx-auto text-gray-500 mt-4 mb-3 text-sm'>
                                <p>Developed with <span className=' text-red-500 mx-[2px] mb-[-3px] inline-block'><FaHeart size={16}/></span> <a href='https://github.com/srivastavas07'>by <span className='font-bold text-gray-300 mx-[1px] '>Kunal&nbsp;Chandra</span></a><FaTrademark className='mx-1 text-blue-400 inline-block mt-[-10px]' /> </p>
                            </div>
                            {/* Already have an account */}
                            {account ? (<span className='text-xs text-[#35fff8] font-semibold'>Register Here 👇🏻</span>) : (<span className='text-xs text-slate-500 font-semibold'>Click here to login 😁</span>)}
                            <div className='sm:flex block items-center mt-[4px]'>
                                <div className='flex items-center'>
                                <button className={`flex items-center mr-[7px] rounded-full p-[5px]  ${account ? " border border-[#ffffff5c] text-[#fff]" : null} text-white hover:text-[#02fff2]`} onClick={() => setAccount(true)}><FaRegThumbsUp className='text-2xl' /></button>
                                <span className='text-lg py-2'>|</span>
                                <button className={`flex items-center mx-[7px] rounded-full p-[5px]  ${!account ? " border border-[#ffffff5c] text-[#fff]" : null} text-white hover:text-[#02fff2]`} onClick={() => setAccount(false)}><FaRegThumbsDown className='text-2xl' /></button>
                                </div>
                                <p className='text-lg py-2 font-bold poppins'>{account ? "Don't have an account ?" :"Already have an account ?" }</p>
                            </div>
                        </div>
                    </div>
                </div>)}
            </section>
    );
}
function Account({ name, email, username, password, setName, setEmail, setUsername, setPassword, submitHandler }) {
    return (
        <form className='my-4' onSubmit={submitHandler}>
            <div className='mb-4'>
                <label htmlFor='email' className='block text-sm font-bold mb-3'>Email</label>
                <input required type='email' value={email} onChange={(e) => setEmail(e.target.value)} id='email' name='email' className='w-full bg-transparent text-white border-bottom outline-none rounded-none' />
            </div>
            <div className='mb-4'>
                <label htmlFor='password' className='block text-sm font-bold mb-3'>Password</label>
                <input required type='password' value={password} onChange={(e) => setPassword(e.target.value)} id='password' name='password' className='w-full bg-transparent text-white border-bottom outline-none rounded-none
                                ' />
            </div>
            <button type='submit' className='bg-transparent text-[#5f9bfa] border border-white w-[60%] hover:bg-slate-800 font-bold py-2 my-2 px-4 rounded-full'>Log In</button>
        </form>
    )
}
function CreateAccount({ name, email, username, password, setName, setEmail, setUsername, setPassword, submitHandler }) {
    return (
        <form className='my-4' onSubmit={submitHandler}>
            <div className='mb-4'>
                <label htmlFor='name' className='block text-sm font-bold mb-3'>Name</label>
                <input required type='text' value={name} onChange={(e) => setName(e.target.value)} id='name' name='name' className='w-full bg-transparent text-white border-bottom outline-none rounded-none' />
            </div>
            <div className='mb-4'>
                <label htmlFor='username' className='block text-sm font-bold mb-3'>Username</label>
                <input required type='text' value={username} onChange={(e) => setUsername(e.target.value)} id='username' name='username' className='w-full bg-transparent text-white border-bottom outline-none rounded-none' />
            </div>
            <div className='mb-4'>
                <label htmlFor='email' className='block text-sm font-bold mb-3' required>Email</label>
                <input required type='email' value={email} onChange={(e) => setEmail(e.target.value)} id='email' name='username' className='w-full bg-transparent text-white border-bottom outline-none rounded-none' />
            </div>
            <div className='mb-4'>
                <label htmlFor='password' className='block text-sm font-bold mb-3' required>Password</label>
                <input required type='password' value={password} id='password' onChange={(e) => setPassword(e.target.value)} name='password' className='w-full bg-transparent text-white border-bottom outline-none rounded-none' />
            </div>
            <button type='submit' className='bg-transparent text-[#5f9bfa] border border-white w-[60%] hover:bg-slate-800 font-bold py-2 my-2 px-4 rounded-full'>Sign in</button>
        </form>
    )
}


export default Login;



