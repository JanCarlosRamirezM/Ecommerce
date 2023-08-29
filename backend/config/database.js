var mongoose = require("mongoose");

const connectDataBase = (DB_LOCAL_URI) => {
  mongoose
    .connect(DB_LOCAL_URI, {
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDb Database connected with HOST ${con.connection.host}`
      );
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = connectDataBase;
