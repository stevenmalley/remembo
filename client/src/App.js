import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from "react-redux";
import localQuizzes from './store/localQuizzes';
import privateQuizzes from './store/privateQuizzes';
import auth from './store/auth';
import LocalQuizProvider from './features/LocalQuizProvider';
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
      </Provider>
    </div>
  );
}

export default App;
