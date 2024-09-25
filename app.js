const express = require("express");
const path = require('path');
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const Pool = require('pg').Pool
const poolOptions = {connectionString: process.env.DATABASE_URL};
if (process.env.DEVELOPMENT !== "true") poolOptions.ssl = {rejectUnauthorized: false};
const pool = new Pool(poolOptions);
const db = require('./db')(pool);

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const validator = require("validator");
const { quizValid, quizEscaped, quizUnescaped } = require("./utils");

const cors = require("cors");
const whitelist = [undefined,'http://localhost:3000','http://localhost:8080','http://remembo.herokuapp.com','https://remembo.herokuapp.com'];
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
    cookie: {
      //maxAge: 6000, // 6 seconds
      //maxAge: 5*60*1000, // 5 minutes
      maxAge: 10*24*60*60*1000, // 10 days
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
if (process.env.DEVELOPMENT !== "true") {
  app.get(/^((?!api).)*$/, // any path except those with "api", redirect to index.html for React Router to handle
    (req, res) => {
      console.log("redirecting to remembo.herokuapp.com");
      //res.sendFile(path.resolve('index.html'));
      res.sendFile('https://remembo.herokuapp.com/');
    }
  );
}


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

app.post("/api/privateQuizzes", // receives {username}
  authenticate,
  async (req,res,next) => {
    const privateQuizzes = await db.getPrivateQuizzes(req.user.username);
    res.status(200).send(privateQuizzes);
  }
);

app.get("/api/quiz/:quizID",
  async (req,res,next) => {
    if (validator.isInt(req.params.quizID)) {
      const quiz = await db.getQuiz(req.params.quizID);
      if (quiz.notFound) res.status(200).send({message:"quiz not found"});
      else if (quiz.data.public || (req.user && quiz.data.owner === req.user.username)) res.status(200).send(quizUnescaped(quiz));
      else res.status(200).send({message:"private quiz"});
    }
  }
);

app.post("/api/quiz", // save new quiz, receives {quiz}
  authenticate,
  async (req,res,next) => {
    const quiz = quizEscaped(req.body);
    if (req.user.username === quiz.data.owner && quizValid(quiz)) {
      const quizID = await db.saveQuiz(quiz);
      res.status(200).send({message:"quiz saved",quizID});
    }
  }
)

app.put("/api/quiz/:quizID", // modify saved quiz, receives {quiz}
  authenticate,
  async (req,res,next) => {
    if (validator.isInt(req.params.quizID)) {

      // check that quiz is private (public quizzes cannot be modified)
      const old_quiz = await db.getQuiz(req.params.quizID);
      if (!old_quiz.data.public) {

        const confirmed = await db.confirmOwnership(req.user.username,req.params.quizID);
        if (confirmed) {
          const quiz = quizEscaped(req.body);
          if (req.params.quizID === String(quiz.data.id) && quizValid(quiz)) {
            await db.modifyQuiz(quiz);
            res.status(200).send({message:"quiz modified"});
          }
        }
      }
    }
  }
)

app.delete("/api/quiz/:quizID", // delete saved quiz, no body
  authenticate,
  async (req,res,next) => {
    if (validator.isInt(req.params.quizID)) {
      const confirmed = await db.confirmOwnership(req.user.username,req.params.quizID);
      if (confirmed) {
        await db.deleteQuiz(req.params.quizID);
        res.status(200).send({message:"quiz deleted"});
      }
    }
  }
)

app.put("/api/publishQuiz/:quizID", // publish saved quiz, no body
  authenticate,
  async (req,res,next) => {
    if (validator.isInt(req.params.quizID)) {
      const confirmed = await db.confirmOwnership(req.user.username,req.params.quizID);
      if (confirmed) {
        await db.publishQuiz(req.params.quizID);
        res.status(200).send({message:"quiz published"});
      }
    }
  }
)

app.put("/api/unpublishQuiz/:quizID", // move public quiz to private, no body
  authenticate,
  async (req,res,next) => {
    if (validator.isInt(req.params.quizID)) {
      const confirmed = await db.confirmOwnership(req.user.username,req.params.quizID);
      if (confirmed) {
        await db.unpublishQuiz(req.params.quizID);
        res.status(200).send({message:"quiz unpublished"});
      }
    }
  }
)



app.get("/api/loginFail",
  (req,res,next) => {res.status(200).send({message:"NOT AUTHENTICATED"})}
);

app.post("/api/login",
  passport.authenticate("local", {failureRedirect: "/api/loginFail"}),
  (req,res,next) => {
    res.status(200).send({message:"AUTHENTICATED",username:req.user.username})
  }
);

app.post("/api/regen",
  authenticate,
  (req,res,next) => {
    req.body = req.user;
    return next();
  },
  passport.authenticate("local", {failureRedirect: "/api/loginFail"}),
  (req,res,next) => {
    res.status(200).send({message:"AUTHENTICATED",username:req.user.username});
  }
);

app.post("/api/checkLogin",
  authenticate,
  (req,res,next) => {
    if (req.body.username === req.user.username) {
      req.body = req.user;
      return next();
    } else {
      req.logout(null,()=>{});
      res.redirect("/api/loginFail");
    }
  },
  passport.authenticate("local", {failureRedirect: "/api/loginFail"}),
  (req,res,next) => {
    res.status(200).send({message:"AUTHENTICATED",username:req.user.username})
  }
);

app.get("/api/logout",
  (req,res,next) => {
    req.logout(null,()=>{});
    res.status(200).send({message:"LOGGED OUT"});
  }
);

app.post("/api/register",
  async (req,res,next) => {
    if (req.body.username === validator.escape(req.body.username) && req.body.password === validator.escape(req.body.password)) {
      await db.register(req.body.username,req.body.password);
      return next();
    } else res.redirect("/api/loginFail");
  },
  passport.authenticate("local", {failureRedirect: "/api/loginFail"}),
  (req,res,next) => {res.status(200).send({message:"AUTHENTICATED",username:req.user.username})}
);



app.listen(process.env.PORT,
  ()=>{console.log("server running on port "+process.env.PORT)});