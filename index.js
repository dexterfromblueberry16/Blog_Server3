const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const app = express();
// const serverless = require('serverless-http');

const router = express.Router();

mongoose.connect(
  "mongodb+srv://Dexter:manish@cluster0.tsrgyd0.mongodb.net/?retryWrites=true&w=majority",
  // "mongodb+srv://Dexter:manish@cluster0.tsrgyd0.mongodb.net/?w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: "BlogDB",
  } 
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDb connected");
});

router.get('/', (req, res) =>{
  res.json({hello: 'world'});
});

// middleware


router.use("/uploads", express.static("uploads"));
router.use(express.json());
const userRoute = require("./routes/user");
router.use("/user", userRoute);
const profileRoute = require("./routes/profile");
router.use("/profile", profileRoute);
const blogRoute = require("./routes/blogpost");
router.use("/blogPost", blogRoute);

app.use('/', router);
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
  
// Set EJS as templating engine 
// app.set("view engine", "ejs");

data = {
  msg: "Welcome on DevStack Blog App development YouTube video series",
  info: "This is a root endpoint",
  Working: "Documentations of other endpoints will be release soon :)",
  request:
    "Hey if you did'nt subscribed my YouTube channle please subscribe it",
};

app.route("/").get((req, res) => res.json(data));

app.listen(port, "0.0.0.0", () =>
  console.log(`welcome your listinnig at port ${port}`)
);


// modules.exports.handler = serverless(app);

module.exports = app;

