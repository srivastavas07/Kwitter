import { FaBell, FaBookmark, FaUser } from 'react-icons/fa';
import { IoHomeSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { TbMessageChatbot } from "react-icons/tb";
import { IoSearch } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { setSearchArea } from '../../redux/propertySlice';

function SideContent() {
    const user = useSelector(store => store.user.user);
    return user ? user._id : null;
    // means if user is true then return its id or return null
}

export const SideBarContent = () => {
    const id = SideContent();
    const {searchArea} = useSelector((store) => store.properties); 
    const {notifications} = useSelector(store=>store.user);
    const hasNotifications = notifications && notifications?.length > 0;
    const dispatch = useDispatch();
    return [
        { label: 'Home', icon: <IoHomeSharp />, path: '/', size: 20},
        { label: 'Chat Bot', icon: <TbMessageChatbot />, path: '/chatBot', size: 25 },
        { label: 'Notifications', icon: <FaBell />, path: `/notifications/${id}`, size: 18,hasNotifications:hasNotifications },
        { label: 'Bookmarks', icon: <FaBookmark />, path: '/bookmark', size: 16 },
        { label: 'Profile', icon: <FaUser />, path: `/profile/${id}`, size: 17 },
        { label: 'Search', icon: <IoSearch onClick={()=>{dispatch(setSearchArea(!searchArea))}}/>, path: null, size: 19 },
    ];

};
