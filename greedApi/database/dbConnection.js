import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            // Modern Mongoose doesn't need these options, but keeping for compatibility
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log(`MongoDB connected! DB Host: ${connectionInstance.connection.host}`);
        console.log(`Database: ${connectionInstance.connection.name}`);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            console.error('Database connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('Database connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

export { connectDB };