import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
// mongodb password: r9DBg2caCzBELEsb
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.log(error);
        //Send an error response if something goes wrong, 1 fail while 0 success
        process.exit(1);
    }
}