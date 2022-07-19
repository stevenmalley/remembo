const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const Pool = require('pg').Pool
const pool = new Pool({connectionString: process.env.DB_CONNECTION_STRING});
const db = require('./db')(pool);




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
  async (req,res,next) => {
    const quizzes = await db.getQuizzes();
    res.status(200).send(quizzes);
  }
);

app.get("/api/quiz/:quizID",
  async (req,res,next) => {
    const quiz = await db.getQuiz(req.params.quizID);
    res.status(200).send(quiz);
  }
);



app.listen(process.env.PORT,
  ()=>{console.log("server running on port "+process.env.PORT)});