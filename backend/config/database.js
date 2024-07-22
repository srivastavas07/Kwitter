import mongoose from "mongoose";
const databaseConnection = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Connected to the DataBase..!!");
        // console.log(process.env.MONGO_URI);
    }).catch((err)=>{
        console.log(err);
    })
}
export default databaseConnection;