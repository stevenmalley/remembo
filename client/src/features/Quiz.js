import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectLocalQuizzes } from '../store/localQuizzes';
import { publishQuiz, unpublishQuiz } from '../store/privateQuizzes';
import { selectAuth } from '../store/auth';
import fetcher from '../fetcher';
import './Quiz.css';

function Quiz () {
  const [ quiz, setQuiz ] = useState({data:{name:"",description:"",owner:""},facts:[{text:"private quiz",revealed:true}]});
  const localQuizzes = useSelector(selectLocalQuizzes);
  const auth = useSelector(selectAuth);

  const { quizID, localID } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    if (localQuizzes[localID]) setQuiz(localQuizzes[localID]);
    else if (quizID) {
      async function getQuiz() {
        const response = await fetcher("/quiz/"+quizID,
          {method: "GET", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}}); // send cookie when retrieving a private quiz
        const jsonResponse = await response.json();
        if (jsonResponse.message !== "private quiz") setQuiz(jsonResponse);
      }
      getQuiz();
    }
  },[localQuizzes]);

  function factClickHandler(i) {
    return e => {
      setQuiz({...quiz, facts: quiz.facts.map((fact,f) => f === i ? {...fact,revealed:true} : fact)});
    }
  }

  function revealAllFacts() {
    setQuiz({...quiz, facts: quiz.facts.map(f => ({...f,revealed:true}))});
  }

  function hintClickHandler(i) {
    return e => {
      if (quiz.facts[i].hint) {
        setQuiz({...quiz, facts: quiz.facts.map((fact,f) => f === i ? {...fact,hintDisplayed:true} : fact)});
      }
    }
  }

  function showAllHints() {
    setQuiz({...quiz, facts: quiz.facts.map(f => ({...f,hintDisplayed:true}))});
  }

  function resetFacts() {
    setQuiz({...quiz, facts: quiz.facts.map(f => ({...f,revealed:false,hintDisplayed:false}))});
  }

  function editQuiz() {
    if (quizID !== undefined) navigate("/buildQuiz/"+quizID);
    else if (localID !== undefined) navigate("/buildQuiz/local/"+localID);
  }

  function publishThisQuiz() {
    dispatch(publishQuiz(quiz));
    setQuiz({...quiz,data:{...quiz.data,public:true}});
  }

  function unpublishThisQuiz() {
    dispatch(unpublishQuiz(quiz));
    setQuiz({...quiz,data:{...quiz.data,public:false}});
  }

  return (
    <div id="quiz">
      <h3>{quiz.data.name}</h3>
      <h4>{quiz.data.description}</h4>
      <h4 className="authorHeading">list author: {quiz.data.owner}</h4>
      {(localID !== undefined || (auth.login && (quiz.data.owner === auth.username) && !quiz.data.public)) ?
        <button onClick={editQuiz} className="rememboButton quizTopButton">edit list</button> : null}
      {(auth.login && (quiz.data.owner === auth.username)) ?
        (quiz.data.public ? <button onClick={unpublishThisQuiz} className="rememboButton quizTopButton">MAKE LIST PRIVATE</button> : <button onClick={publishThisQuiz} className="rememboButton quizTopButton">MAKE LIST PUBLIC</button>)
        : null}
      {quiz.facts.map((fact,i) => (
        <div key={"fact"+i} id={"fact"+i} className={"factWrapper "+(fact.revealed ? "factRevealed" : "")}>
          <div onClick={factClickHandler(i)} className="textWrapper">
            {fact.revealed ? <div className="fact-text">{fact.text}</div> : null}
            {fact.revealed ? <div className="fact-info">{fact.info}</div> : null}
            {!fact.revealed && fact.hint && fact.hintDisplayed ? <div className="fact-hint">{fact.hint}</div> : null}
          </div>
          {!fact.revealed && fact.hint && !fact.hintDisplayed ? <button className="hintButton" onClick={hintClickHandler(i)}>hint</button> : null }
        </div>
      ))}

      <button className={quiz.facts.some(fact => !fact.revealed && fact.hint && !fact.hintDisplayed) ? "allHintButton quizButton" : "irrelevantButton quizButton"}
        onClick={showAllHints}>show all hints</button>
      <button className={quiz.facts.some(fact => !fact.revealed) ? "allFactButton quizButton" : "irrelevantButton quizButton"}
        onClick={revealAllFacts}>reveal all items</button>
      <button className="resetButton quizButton" onClick={resetFacts}>reset list</button>

      <div>
        <Link to="/" className="rememboButton">return to list menu</Link>
      </div>
    </div>
  );
}


export default Quiz;