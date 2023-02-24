const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const env=require('dotenv');
app.use(cookieParser());
env.config({path:'./config.env'});
require('./DB/database.js');
const cors=require('cors');



port=process.env.PORT;

app.use(express.json());
app.use(cors())


app.use(require('./Router/Auth.js'))

//linking auth file through app.use() middleware
app.get("/", (req, res) => {
  res.send(`<h2>Hello World from Backend!</h2>`);
});


app.listen(port, () => {
  console.log("Server Listening on Port :" + port);
});

