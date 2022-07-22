const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const Pool = require('pg').Pool
const pool = new Pool({connectionString: process.env.DB_CONNECTION_STRING});
const db = require('./db')(pool);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
const whitelist = [undefined,'http://localhost:3000','http://localhost:8080'];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));
//app.use(cors());

const session = require("express-session");
app.use(
  session({
    secret: process.env.EXPRESS_SECRET,
    cookie: {maxAge: 5*60*1000, // 5 minutes
			secure:false,
			httpOnly:false},
    resave: false,
    saveUninitialized: false
  })
);

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.findByUsername(username, (err, user) => { // Look up user in the db (user: {id,username,password})
      if(err) return done(err); // If there's an error in db lookup, return err callback function
      if(!user) return done(null, false); // If user not found, return null and false in callback
      if(user.password != password) return done(null, false); // If user found, but password not valid, return err and false in callback
      return done(null, user); // If user found and password valid, return the user object in callback
    });
  })
);
passport.serializeUser((user,done) => { // serialisation & deserialisation allows a session to persist if a user refreshes their browser
  done(null,user.id); // sets the id as the user's browser cookie and stores it in req.session.passport.user.id
});
passport.deserializeUser((id, done) => {
  db.findById(id, function (err, user) { // Look up user id in database
    if (err) return done(err);
    done(null, user);
  });
});

function authenticate(req,res,next) {
  if (req.isAuthenticated()) return next();
  res.status(200).send({"message":"NOT AUTHENTICATED"});
}
function authenticateAdmin(req,res,next) {
  if (req.isAuthenticated() && req.user.username === 'admin') return next();
  res.status(200).send({"message":"only admin can perform this function!"});
}



app.use(express.static("client/build"));

app.use("/api",
  (req,res,next)=>{
    console.log(req.method,req.path,Object.keys(req.body));
    return next();
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

app.post("/api/quiz", // save new quiz
  async (req,res,next) => {
    
  }
)

app.put("/api/quiz/:quizID", // modify saved quiz
  async (req,res,next) => {
    
  }
)

app.delete("/api/quiz/:quizID", // delete saved quiz
  async (req,res,next) => {
    
  }
)



app.get("/api/loginFail",
  (req,res,next) => {res.status(400).send({message:"NOT AUTHENTICATED"})}
);

app.post("/api/login",
  passport.authenticate("local", {failureRedirect: "/api/loginFail"}),
  (req,res,next) => {res.status(200).send({message:"AUTHENTICATED",username:req.user.username})}
);

app.get("/api/logout",
  (req,res,next) => {
    req.logout(null,()=>{});
    res.status(200).send({message:"LOGGED OUT"});
  }
);

app.post("/api/register",
  async (req,res,next) => {await db.register(req.body.username,req.body.password); next();},
  passport.authenticate("local", {failureRedirect: "/api/loginFail"}),
  (req,res,next) => {res.status(200).send({message:"AUTHENTICATED",username:req.user.username})}
);



app.listen(process.env.PORT,
  ()=>{console.log("server running on port "+process.env.PORT)});