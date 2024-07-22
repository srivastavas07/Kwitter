import React from 'react'
import { FaHeart } from 'react-icons/fa';
import { FaTrademark } from 'react-icons/fa';
import twitterLogo from '../Assets/twitterLogo.png'
function ErrorPage() {
    return (
        <div className='flex justify-center items-center w-[100vw] h-[100vh]'>
            <div className='absolute top-6 left-6'>
                <div className='flex items-center justify-center'>
                <img src={twitterLogo} style={{ height: '60px' }} alt="logo" />
                <p className='text-[32px] logoFont text-white ml-3'>Kwitter</p>
                </div>
            </div>
            <div className='absolute bottom-3 right-5'>
                <div className='terms w-full mx-auto text-gray-500 my-4 text-sm'>
                    <p className='flex items-center'>Developed with <span className=' text-red-500 mx-1'><FaHeart /></span> <a className='' href='https://github.com/srivastavas07'>by <span className='font-bold text-gray-300'>Kunal Chandra</span></a><FaTrademark className='mx-1 text-blue-400' /> </p>
                </div>
            </div>
            <a href="https://www.linkedin.com/in/chandra07ks/" className='absolute top-6 right-6' title='linkedIn'>
            <img className = "rounded-full" src="https://avatars.githubusercontent.com/u/72646476?v=4"  style={{
                    height: '50px',
                }} alt="Kunal-developer-kwitter"/>
            </a>
            <h1 className='text-8xl'><span className='text-4xl'>Oops this page isn't available.</span> 404 <span className='text-4xl'>:(</span></h1>

        </div>
    )
}


export default ErrorPage