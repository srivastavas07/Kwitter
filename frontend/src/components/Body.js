import React from 'react';
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import FeedContent from './FeedContent';
import BookmarkSection from './BookmarkSection';
import CommentsSection from './CommentsSection';
import NotificationSection from './NotificationSection';
import ChatBot from './ChatBot';
import ErrorPage from './ErrorPage';

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          path:"/",
          element: <FeedContent/>,
        },
        {
          path: "/profile/:id",
          element: <Profile/>,
        },
        {
          path: "/bookmark",
          element: <BookmarkSection/>,
        },
        {
          path:"/comments/:id",
          element: <CommentsSection/>
        },
        {
          path:"/notifications/:id",
          element: <NotificationSection/>
        },
        {
          path:"/chatBot",
          element:<ChatBot/>
        }
      ],
    },
    {
      path: "/home",
      element: <Home/>
    },
    {
      path: "/login",
      element: <Login/>,
    },
    {
      path:"*",
      element: <ErrorPage/>,
    }
  ]);
  return (
    <div className='bg-black'>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default Body