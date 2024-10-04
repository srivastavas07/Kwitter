import mongoose from "mongoose";
const databaseConnection = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to the DataBase..!!');
    } catch (err) {
      console.log('Error connecting to the database:', err);
    }
  }
export default databaseConnection;  