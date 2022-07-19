import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLocalQuizzes } from '../store/localQuizzes';
import fetcher from '../fetcher';
import './Quizzes.css';


function Quizzes() {
  const [publicQuizzes, setPublicQuizzes] = useState([]);

  const localQuizzes = useSelector(selectLocalQuizzes);

  useEffect(()=>{
    async function getQuizzes() {
      const response = await fetcher("/quizzes");
      const jsonResponse = await response.json();
      setPublicQuizzes(jsonResponse.quizzes);
    }
    getQuizzes();
  },[]);

  return (
    <div>
    <h2 className="quizzesHeader">Public Quizzes</h2>
    {publicQuizzes.map(quiz => (
      <Link key={"quiz"+quiz.id} to={"quiz/"+quiz.id} className="quizLink">{quiz.name}</Link>
    ))}
    <h2 className="quizzesHeader">My Quizzes</h2>
    {localQuizzes.map((quiz,i) => (
      <Link key={"localQuiz"+i} to={"buildQuiz/"+i} className="quizLink">{quiz.data.name}</Link>
    ))}
    <Link to="buildQuiz/">create new quiz</Link>
    </div>
  );
}


export default Quizzes;