import { FaBell, FaBookmark, FaUser } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { TbMessageChatbot } from "react-icons/tb";
function SideContent() {
    const user = useSelector(store => store.user.user);
    return user ? user._id : null;
    // means if user is true then return its id or return null
}

export const SideBarContent = () => {
    const id = SideContent();
    const {notifications} = useSelector(store=>store.user);
    const hasNotifications = notifications && notifications?.length > 0;
    return [
        { label: 'Home', icon: <IoHomeSharp />, path: '/' },
        { label: 'Chat Bot', icon: <TbMessageChatbot size={30} />, path: '/chatBot'},
        { label: 'Notifications', icon: <FaBell size={23} />, path: `/notifications/${id}`,hasNotifications:hasNotifications },
        // { label: 'Messages', icon: <FaEnvelope /> },
        { label: 'Bookmarks', icon: <FaBookmark size={20} />, path: '/bookmark' },
        { label: 'Profile', icon: <FaUser size={22} />, path: `/profile/${id}` },
    ];
};
