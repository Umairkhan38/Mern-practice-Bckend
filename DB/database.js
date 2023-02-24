const mongoose = require("mongoose");
mongoose.set("strictQuery", false);   //its just to avoid deprecate warning (Optional)

//MongoDb Connection String
const conStr = process.env.Database;

mongoose.connect(conStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connection Successfull!");
  })
  .catch((err) => console.log(err));


 