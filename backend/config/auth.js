import jwt from "jsonwebtoken";
const isAuthenticated = async(req,res,next) => {
    try{
        const {token} = req.cookies;
        console.log("token printing..")
        console.log(token);
        if(!token){
            return res.status(401).json({
                message:"User Unauthorised..!!",
                success:false,
            })
        }
        const decode = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user =decode.userId;
        next();
    }catch(error){
        console.log(error);
    }
}
export default isAuthenticated;