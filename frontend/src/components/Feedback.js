import React from 'react'
import ReactDOM from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';


const Feedback = ({ setFeedback }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [feedbackValue, setFeedbackValue] = useState("");
    const [loading, setLoading] = useState(false);
    const submitHandler = () => {
        setLoading(true);
        // when adding api key using process.env.REACT_API_KEY restart the app as it wont detect.
        if(!email || !name || !feedbackValue) {
            toast.error("Please fill all the fields");
            setLoading(false);
            return;
        };
        emailjs.send(process.env.REACT_APP_SERVICE_ID, process.env.REACT_APP_TEMPLATE_ID, {
            from_email: email,
            from_name: name,
            message: feedbackValue
        }, process.env.REACT_APP_API_KEY).then((result) => {
            setEmail("");
            setName("");
            setFeedbackValue("");
            setLoading(false);
            toast.success("Sent ✅ Thank You for your feedback 🍻");
        },).catch((error) => {
            toast.error(error);
        })
    }
    
    return ReactDOM.createPortal(
        <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[2px]'>
            <div className='relative p-3 bg-black border border-white rounded-lg sm:w-[40%] w-[85%]'>
                <button onClick={() => setFeedback(false)} className='absolute top-[8px] right-[8px]'>
                    <RxCross2 size={15} />
                </button>
                <p className='text-md font-semibold text-slate-400 mb-1'>Name</p>
                <input value ={name} onChange={(e) => setName(e.target.value)} type="text" className='w-full bg-black p-1 my-2 outline-none text-sm placeholder:text-xs' placeholder='Kunal Chandra' />
                <p className='text-md font-semibold text-slate-400 mb-1'>Email</p>
                <input value = {email} onChange={(e) => setEmail(e.target.value)} type="email" className='w-full bg-black p-1 my-2 outline-none text-sm placeholder:text-xs' placeholder='Email@gmail.com' />
                <p className='text-md font-semibold text-slate-400 mb-1'>Feedback</p>
                <textarea onChange={(e) => setFeedbackValue(e.target.value)} value={feedbackValue} className='w-full bg-black p-1 my-2 resize-none h-[80px] outline-none text-sm placeholder:text-xs' placeholder='Enter your feedback here.'></textarea>
                <button onClick={submitHandler} className='px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-md'>Submit</button>{loading?<span className='text-xs font-semibold px-2 text-[#008ccd]'>Sending Please wait.</span>:null}
            </div>
        </div>,
        document.body
    )
}

export default Feedback