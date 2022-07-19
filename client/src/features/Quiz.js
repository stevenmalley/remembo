import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fetcher from '../fetcher';
import './Quiz.css';

function Quiz () {
  const [ quiz, setQuiz ] = useState({data:{name:"",description:""},facts:[]});

  const { quizID } = useParams();

  useEffect(()=>{
    async function getQuiz() {
      const response = await fetcher("/quiz/"+quizID);
      const jsonResponse = await response.json();
      setQuiz(jsonResponse);
    }
    getQuiz();
  },[]);

  function factClickHandler(fact) {
    return e => {
      setQuiz({...quiz, facts: quiz.facts.map(f => f.id === fact.id ? {...f,revealed:true} : f)});
    }
  }

  function revealAllFacts() {
    setQuiz({...quiz, facts: quiz.facts.map(f => ({...f,revealed:true}))});
  }

  function hintClickHandler(fact) {
    return e => {
      if (fact.hint) {
        setQuiz({...quiz, facts: quiz.facts.map(f => f.id === fact.id ? {...f,hintDisplayed:true} : f)});
      }
    }
  }

  function showAllHints() {
    setQuiz({...quiz, facts: quiz.facts.map(f => ({...f,hintDisplayed:true}))});
  }

  function resetFacts() {
    setQuiz({...quiz, facts: quiz.facts.map(f => ({...f,revealed:false,hintDisplayed:false}))});
  }

  return (
    <div id="quiz">
      <h3>{quiz.data.name}</h3>
      <h4>quiz author: {quiz.data.owner}</h4>
      {quiz.facts.map(fact => (
        <div key={"fact"+fact.id} id={"fact"+fact.id} className="factWrapper" style={{backgroundColor:fact.revealed ? "white" : "gold"}}>
          <div onClick={factClickHandler(fact)} className="textWrapper">
            {fact.revealed ? <div className="fact-text">{fact.text}</div> : null}
            {fact.revealed ? <div className="fact-info">{fact.info}</div> : null}
            {!fact.revealed && fact.hint && fact.hintDisplayed ? <div className="fact-hint">{fact.hint}</div> : null}
          </div>
          {!fact.revealed && fact.hint && !fact.hintDisplayed ? <button className="hintButton" onClick={hintClickHandler(fact)}>hint</button> : null }
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