import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getNotifications } from "../redux/userSlice";
import axios from "axios";
import { USER_END_POINT } from "../utils/constants.js";

const useGetNotifications = () => {
    const {user} = useSelector((store) => store.user);
    const {refresh} = useSelector((store) => store.tweets);
    const dispatch = useDispatch();
    const get_Notifications = async () => {
        try {
            const response = await axios.get(`${USER_END_POINT}/notifications/${user?._id}`, {
                withCredentials: true,
            })
            console.log(response.data.notifications);
            dispatch(getNotifications(response.data.notifications))
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        get_Notifications();
    }, [refresh]);
};
export default useGetNotifications;
