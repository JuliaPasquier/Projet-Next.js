import mongoose from 'mongoose';

let connected = false;  

const connectDB = async () => {

    mongoose.set('strictQuery', true);

    if (connected) {
        console.log('MongoDb is already connected');
        return;
    }

    //Connect to MongoDB

    try {
        await mongoose.connect(process.env.MONGODB_URI);
       connected = true; 
       console.log('MongoDb is connected');
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;