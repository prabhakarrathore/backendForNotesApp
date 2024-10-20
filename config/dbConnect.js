const mongoose = require('mongoose');
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (error) {
        console.error(error)
    }
}

module.exports = { dbConnect };