const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ Base de datos conectada correctamente.");
    } catch (error) {
        console.error("❌ Error al conectar la base de datos:", error);
        process.exit(1);
    }
}

module.exports = connectDB;