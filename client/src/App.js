import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from "react-redux";
import localQuizzes from './store/localQuizzes';
import privateQuizzes from './store/privateQuizzes';
import auth from './store/auth';
import AccountBar from './features/AccountBar';
import About from './features/About';
import Quizzes from './features/Quizzes';
import Quiz from './features/Quiz';
import QuizBuilder from './features/QuizBuilder';
import Login from './features/Login';
import Register from './features/Register';
import './App.css';

function App() {

  const store = configureStore({
    reducer: combineReducers({
      localQuizzes:localQuizzes.reducer,
      privateQuizzes:privateQuizzes.reducer,
      auth:auth.reducer
    })
  });
  
  useEffect(() => {
    window.removeEventListener("keypress",revealNextFact); // guarantee only one instance of the event listener exists
    window.addEventListener("keypress",revealNextFact);
  },[]);
  function revealNextFact(e) {
    // create this function here and pass as a prop so that removeEventListener will work
    if (e.code == "KeyN" && e.target.tagName !== "INPUT" && e.target.type !== "text") {
      // press N to reveal the next fact
      e.preventDefault();
      
      let nextFact = document.querySelector(".factWrapper:not(.factRevealed) .textWrapper");
      if (nextFact) {
        window.scrollTo(0,window.scrollY+nextFact.getBoundingClientRect().top-(window.innerHeight/2));
        nextFact.click();
      }
    }

    else if (e.code == "KeyH" && e.target.tagName !== "INPUT" && e.target.type !== "text") {
      // press H to reveal the next hint
      e.preventDefault();
      
      let nextFact = document.querySelector(".hintButton");
      if (nextFact) {
        window.scrollTo(0,window.scrollY+nextFact.getBoundingClientRect().top-(window.innerHeight/2));
        nextFact.click();
      }
    }

    else if (e.code == "KeyR" && e.target.tagName !== "INPUT" && e.target.type !== "text") {
      // press R to reset the list
      e.preventDefault();
      let revealButton = document.querySelector(".allFactButton");
      if (revealButton) revealButton.click();
      else document.querySelector(".resetButton").click();
    }
  }
  
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <AccountBar />
          <NavLink to="/"><h1 id="rememboHeader">REMEMbO</h1></NavLink>
          <Routes>
            <Route path="/" element={<Quizzes />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz/:quizID" element={<Quiz />} />
            <Route path="/quiz/local/:localID" element={<Quiz />} />
            <Route path="/buildQuiz/" element={<QuizBuilder />} />
            <Route path="/buildQuiz/:quizID" element={<QuizBuilder />} />
            <Route path="/buildQuiz/local/:localID" element={<QuizBuilder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
        <div id="buyMeACoffee">
          <a href="https://buymeacoffee.com/malleus">buy me a coffee
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
              <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
            </svg>
          </a>
        </div>
      </Provider>
    </div>
  );
}

export default App;
