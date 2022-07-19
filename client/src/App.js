import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from "react-redux";
import Quizzes from './features/Quizzes';
import Quiz from './features/Quiz';
import QuizBuilder from './features/QuizBuilder';
import localQuizzes from './store/localQuizzes';
import './App.css';

function App() {

  const store = configureStore({
    reducer: combineReducers({
      localQuizzes:localQuizzes.reducer
    })
  });
  
  return (
    <div className="App">
      <Provider store={store}>
      <Router>
      <NavLink to="/"><h1 id="rememoHeader">REMEMO</h1></NavLink>
        <Routes>
          <Route path="/" element={<Quizzes />} />
          <Route path="/quiz/:quizID" element={<Quiz />} />
          <Route path="/buildQuiz/" element={<QuizBuilder />} />
          <Route path="/buildQuiz/:localID" element={<QuizBuilder />} />
        </Routes>
      </Router>
      </Provider>
    </div>
  );
}

export default App;
