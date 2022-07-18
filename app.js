const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());



app.use(express.static("client/build"));

app.use("/api",
  (req,res,next)=>{
    console.log(req.method,req.path,Object.keys(req.body));
    return next();
  }
);

app.get("/api/hello",
  (req,res,next) => {
	  res.status(200).send({message:"hello"});
  }
);

app.get("/api/quizzes",
  (req,res,next) => {
    
  }
);



app.listen(process.env.PORT,
  ()=>{console.log("server running on port "+process.env.PORT)});