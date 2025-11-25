const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Base de datos MongoDb¿B conectada: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error al conectarse a base de datos MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;