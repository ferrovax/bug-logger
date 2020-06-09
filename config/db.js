
const secret = require('../secret');
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://Ferrovax:${secret}@cluster0-zfqqm.mongodb.net/buglogger?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      }
    );

    console.log('MongoDB connected');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

module.exports = connectDB;
