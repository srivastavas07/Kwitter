import { USER_END_POINT } from "../utils/constants";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getOtherUsers} from "../redux/userSlice";
const useGetOtherUsers = (id) => {
    const dispatch = useDispatch();
    const {refresh} = useSelector(store=>store.tweets);
    useEffect(() => {
        const fetchOtherUser = async () => {
            try{
                const response = await axios.get(`${USER_END_POINT}/otherUsers/${id}`,{
                    withCredentials: true,
                });
                dispatch(getOtherUsers(response?.data?.otherUser));
            }catch(error){
                console.log(error);
            }
        }
        fetchOtherUser();
    },[refresh,dispatch,id])
}
export default useGetOtherUsers;