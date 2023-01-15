import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPrivateQuizzes } from '../store/privateQuizzes';
import { selectLocalQuizzes } from '../store/localQuizzes';
import fetcher from '../fetcher';
import './Quizzes.css';


function Quizzes() {
  const [publicQuizzes, setPublicQuizzes] = useState([]);

  const privateQuizzes = useSelector(selectPrivateQuizzes);
  const localQuizzes = useSelector(selectLocalQuizzes);

  useEffect(()=>{
    async function getQuizzes() {
      const response = await fetcher("/quizzes");
      const jsonResponse = await response.json();
      setPublicQuizzes(jsonResponse);
    }
    getQuizzes();
  },[]);

  return (
    <div>
      <Link to="about/" className="rememboButton">ABOUT</Link>
      <div id="publicLists">
        <h2 className="quizzesHeader">Public Lists</h2>
        {publicQuizzes.map(quiz => (
          <Link key={"quiz"+quiz.id} to={"quiz/"+quiz.id} className="quizLink">{quiz.name}</Link>
        ))}
      </div>
      <div id="localOrPrivateLists">
        <h2 className="quizzesHeader">My Lists</h2>
        {localQuizzes.length > 0 ? <p style={{color:"red"}}>log in to save these lists</p> : null}
        {privateQuizzes.map(quiz => (
          <Link key={"privateQuiz"+quiz.id} to={"quiz/"+quiz.id} className="quizLink">{quiz.name}</Link>
        ))}
        {localQuizzes.map((quiz,i) => (
          <Link key={"localQuiz"+i} to={"quiz/local/"+i} className="quizLink">{quiz.data.name}</Link>
        ))}
        <Link to="buildQuiz/" className="newQuizLink" id="createQuizButton">create new list</Link>
      </div>
    </div>
  );
}


export default Quizzes;