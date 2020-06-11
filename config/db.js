//const secret = require('../secret');
const mongoose = require('mongoose'); 

const connectDB = async (username, password) => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0-zfqqm.mongodb.net/buglogger?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      }
    );

    console.log('MongoDB connected');
    return true;
  } catch (e) {
    console.log(e);
    //process.exit(1);
    return false;
  }
}

module.exports = connectDB;
