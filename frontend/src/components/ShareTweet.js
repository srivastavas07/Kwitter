import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { FaCopy } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, LinkedinShareButton } from "react-share"
import { LinkedinIcon } from 'react-share';
import { toast } from 'react-hot-toast';

const ShareTweet = ({ userDetails, setShowShare, tweet }) => {
    const baseUrl = "http://localhost:3000/"
    const textToCopy = baseUrl + "comments/" + tweet?._id;
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            {/*navigator.clipboard
            Navigator Object: In web browsers, navigator is a global object that provides information about the browser environment and user's system.
            Clipboard API: navigator.clipboard is a part of the Navigator interface that provides an interface to interact with the system clipboard, allowing JavaScript code to read from and write to it.
            writeText(textToCopy)
            writeText() Method: This method is available on navigator.clipboard and is specifically used to write (or copy) text to the user's clipboard.
            Parameters:
            textToCopy: This is a required parameter and should be a string containing the text you want to copy to the clipboard.
            How It Works:
            Permissions: Browsers typically require user interaction (e.g., a click event) to initiate clipboard operations for security reasons. This means that writeText() should be called in response to a user action like clicking a button.
            Copying Text:
            When writeText(textToCopy) is called, the browser attempts to copy the specified textToCopy to the clipboard.
            If successful, the text is now available in the clipboard for the user to paste elsewhere (e.g., in another application, text field, etc.).
            If unsuccessful (for example, due to browser settings or permissions), it may throw an error. You can handle these errors in your code to provide feedback to the user if needed.*/}
            toast.success("Copied to clipboard");
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };
    const capiName = userDetails?.name ? userDetails?.name.charAt(0).toUpperCase() + userDetails?.name.slice(1) : '';
    const title = `Check out this Tweet by - ${capiName}`
    const size = 40;
    const url = baseUrl + "comments/" + tweet?._id;
    return ReactDOM.createPortal(
        <div className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-[2px]'>
            <div className='relative p-3 bg-black border border-white rounded-lg min-w-[20%]'>
                <button onClick={() => setShowShare(false)} className='absolute top-[8px] right-[8px]'>
                    <RxCross2 size={15} />
                </button>
                <div className='shareContent mx-auto flex items-center justify-center'>
                    <TwitterShareButton
                        url={url}
                        title={title}

                        className='my-10 mr-2'
                    >
                        <TwitterIcon size={size} round />
                    </TwitterShareButton>
                    <WhatsappShareButton
                        url={url}
                        title={title}
                        className='my-10 mr-2'
                    >
                        <WhatsappIcon size={size} round />
                    </WhatsappShareButton>
                    <FacebookShareButton
                        url={url}
                        title={title}
                        className='my-10 mr-2'>
                        <FacebookIcon size={size} round />
                    </FacebookShareButton>
                    <LinkedinShareButton
                        url={url}
                        title={title}
                        className='my-10 mr-2'
                    >
                        <LinkedinIcon size={size} round />
                    </LinkedinShareButton>
                    <div onClick={() => copyToClipboard()} className='bg-slate-500 p-3 rounded-full cursor-pointer'>
                        <FaCopy size={20} />
                    </div>
                </div>
            </div>
        </div>, document.body
    )
}

export default ShareTweet