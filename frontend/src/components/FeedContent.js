import React from 'react';
import TweetSection from './TweetSection';

function FeedContent() {
  return (
    <div className={`w-[100vw] sm:w-[50%] border-right`}>
     <TweetSection/>
    </div>
  );
}

export default FeedContent;
