import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaArrowUpLong } from "react-icons/fa6";
import axios from 'axios';
import { TWEET_END_POINT } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addBotMessage } from '../redux/tweetSlice';
import { FaDeleteLeft } from "react-icons/fa6";
import ReactMarkdown from 'react-markdown';
import { clearChat } from '../redux/tweetSlice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const ChatBot = () => {
    const contextLength = -10;
    const dispatch = useDispatch();
    const textAreaRef = useRef();
    const messagesEndRef = useRef();
    const { botChat } = useSelector(store => store.tweets)
    const [query, setQuery] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [context, setContext] = useState(botChat.slice(contextLength));

    useEffect(() => {
        textAreaRef.current.style.height = "10px";
        textAreaRef.current.style.height = Math.min(textAreaRef.current.scrollHeight, 200) + "px";
    }, [query]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setContext(botChat.slice(contextLength));
    }, [botChat])

    const handleEnter = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            Kuksie();
        }
    }
    const Kuksie = async () => {
        const qu = query;
        console.log(context);
        setQuery("");
        setChatLoading(true);
        dispatch(addBotMessage({ text: qu, user: "You" }))

        try {
            const response = await axios.get(`${TWEET_END_POINT}/chat-bot`, {
                params: {
                    query: qu,
                    context: context
                },
                withCredentials: true
            })
            dispatch(addBotMessage({ text: response?.data?.text, user: response?.data?.user }));
            setChatLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }
    const { user } = useSelector((store) => store.user);
    return (
        <div className='sm:w-[50%] w-[100%] relative h-[100vh] border-right'>
            <div className='p-4 border-bottom absolute top-0 w-full backdrop-blur-md'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <div>
                            <Link to="/">
                                <button className="bg-transparent border-none focus:outline-none">
                                    <IoMdArrowRoundBack className="text-gray-500 h-6 w-6 hover:text-white" />
                                </button>
                            </Link>
                        </div>
                        <div className='ml-2'>
                            <h1 className='text-2xl font-bold'>Kuksie</h1>
                            <p className=' text-gray-300 text-sm'>ur true frnd..❤️</p>
                        </div>
                    </div>
                    <div className=''>
                        <FaDeleteLeft title="Clear Chat" onClick={() => { dispatch(clearChat()); setContext("") }} size={25} />
                    </div>
                </div>
            </div>
            <div className='flex flex-col justify-between h-full'>
                <div className='flex-1 overflow-y-auto sm:max-h-[100vh] max-h-[88vh] pt-[125px] pb-[96px] w-full scroll'>
                    <div className='mb-3 text-left leading-9'>
                        <div className='inline-block p-3 ml-3 rounded-lg text-[14.5px] bg-gray-800'>
                            <p className='entryMessage'>Hello! I am Kuksie. How can I help you today? 😁🐣</p>
                        </div>
                    </div>
                    {botChat?.map((message, index) => (
                        <div key={index} className={`mb-4 ${message?.user === 'You' ? 'text-right mx-4 leading-6' : 'text-left mx-4 leading-10'} markdown-container bot-chat`}>
                            <div className={`inline-block p-3 rounded-lg text-[14.5px] ${message?.user === 'You' ? 'bg-[#202020] text-left text-white' : 'bg-gray-800'}`}>
                                <ReactMarkdown
                                    components={{
                                        code({ className, children }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return (
                                                <SyntaxHighlighter style={atomDark} language={match ? match[1] : 'jsx'} customStyle={{
                                                    background: "rgb(11, 19, 36,1)",
                                                    maxWidth: "fit-content",
                                                    display: 'inline-block',
                                                    padding: " 5px 10px ",
                                                    margin: "0px 4px -10px",
                                                    overflowY: "auto",

                                                }}>
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            );
                                        }
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className='mb-2 text-left'>
                            <div className='inline-block p-4 rounded-lg text-[14.5px] ml-3 bg-gray-800'>
                                <div className='little-loader'></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className='sm:p-3 p-1 border-t absolute sm:bottom-0 bottom-[52px] w-full backdrop-blur-md bg-[#0000007f] border-gray-500 flex'>
                    <textarea
                        ref={textAreaRef}
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleEnter}
                        className='flex-1 p-2 focus:outline-none bg-transparent resize-none max-h-[30%] overflow-y-auto'
                        placeholder='Type a message...'
                    />
                    <button
                        className='bg-slate-600 mt-auto text-white px-[14px] ml-1 rounded-full h-10 hover:bg-slate-500'
                        onClick={() => Kuksie()}
                        title="Send Message"
                    >
                        <FaArrowUpLong size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatBot;

// NOTES FOR SET RESPONSE

//Using Functional Updates:

// Original Approach:
// setResponse([...kukuResponse, { text: qu, user: "You" }]);
// This directly updates the state with the current value of kukuResponse and the new user message.

// Functional Update Approach:
// setResponse(prevResponses => [...prevResponses, { text: qu, user: "You" }]);
// This ensures that the update is based on the most recent state value of kukuResponse.

// Sequential State Updates:

// Original Approach:

// setResponse([...kukuResponse, { text: qu, user: "You" }]);

// setResponse([...kukuResponse, response.data]);
// In this case, kukuResponse may not have the most recent user message when adding the bot's response, causing the user message to be lost.

// Functional Update Approach:
// setResponse(prevResponses => [...prevResponses, { text: qu, user: "You" }]);

// setResponse(prevResponses => [...prevResponses, { text: response.data.message, user: "Kuksie" }]);
// Each update is based on the latest state, ensuring that both the user message and bot response are included.