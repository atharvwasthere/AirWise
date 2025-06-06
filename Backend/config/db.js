import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI,{
            maxPoolSize: 10,
        });
        //console.log(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error){
        console.log('MongoDB connection error:',error);
        process.exit(1);
    }
};

export default connectDB;
