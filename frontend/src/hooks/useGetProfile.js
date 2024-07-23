import { USER_END_POINT } from "../utils/constants"
import axios from "axios";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {getProfile} from "../redux/userSlice";
const useGetProfile = (id) => {
    const dispatch = useDispatch();
    const {refresh} = useSelector(store=>store.tweets);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                
                const response = await axios.get(`${USER_END_POINT}/profile/${id}`, {
                    withCredentials: true,
                })
                dispatch(getProfile(response?.data?.user));
            } catch (error) {
                console.log(error)
            }
        }
        fetchProfile();
    }, [refresh,id]);
}
export default useGetProfile;