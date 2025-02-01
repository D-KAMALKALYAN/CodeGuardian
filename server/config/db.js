//  const mongoose = require('mongoose');

//  const connectDB = async() => {
//     try {
//         mongoose
//           .connect(process.env.MONGO_URI)
//           .then(() => {
//             console.log(`Connected to MongoDB : : ${conn.connection.host}`);
//           })
//     } catch (err) {
//         console.error(`Error: ${error.message}`);
//         process.exit(1);
//     }
//  }
// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Connected to MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
