const mongoose = require("mongoose");

const db = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  });

  console.log(`DB Host: ${conn.connection.host}`.cyan.bold.underline);
};
module.exports = db;
