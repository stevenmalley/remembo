import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLocalQuizzes } from '../store/localQuizzes';
import fetcher from '../fetcher';
import './Quiz.css';

function Quiz () {
  const [ quiz, setQuiz ] = useState({data:{name:"",description:""},facts:[]});
  const localQuizzes = useSelector(selectLocalQuizzes);

  const { quizID, localID } = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    if (localID !== undefined) {
      setQuiz(localQuizzes[localID]);
    } else {
      async function getQuiz() {
        const response = await fetcher("/quiz/"+quizID);
        const jsonResponse = await response.json();
        setQuiz(jsonResponse);
      }
      getQuiz();
    }
  },[]);

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
    navigate("/buildQuiz/local/"+localID);
  }

  return (
    <div id="quiz">
      <h3>{quiz.data.name}</h3>
      <h4>{quiz.data.description}</h4>
      <h4>quiz author: {quiz.data.owner}</h4>
      {localID !== undefined ? <button onClick={editQuiz}>EDIT QUIZ</button> : null}
      {quiz.facts.map((fact,i) => (
        <div key={"fact"+i} id={"fact"+i} className="factWrapper" style={{backgroundColor:fact.revealed ? "white" : "gold"}}>
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
        onClick={revealAllFacts}>reveal all facts</button>
      <button className="resetButton quizButton" onClick={resetFacts}>reset quiz</button>
    </div>
  );
}


export default Quiz;