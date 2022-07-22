import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addQuiz, modifyQuiz, deleteQuiz, selectLocalQuizzes } from '../store/localQuizzes';
import { selectAuth } from '../store/auth';
import QuizBuilderItem from './QuizBuilderItem';
import './QuizBuilder.css';


function QuizBuilder() {
  
  const navigate = useNavigate();
  const { localID } = useParams();
  const auth = useSelector(selectAuth);
  const username = auth.login ? auth.username : "me";
  const localQuizzes = useSelector(selectLocalQuizzes);
  const [ quiz, setQuiz ] = useState({data:{name:"",description:"",owner:username},facts:[{text:"",info:"",hint:""}]});
  const [ changed, setChanged ] = useState(false);

  useEffect(()=>{
    if (localQuizzes[localID]) setQuiz(localQuizzes[localID]);
  },[localQuizzes]);
  
  const dispatch = useDispatch();

  function changeHandler(e) {
    if (!changed) setChanged(true);
    saveQuiz();
  }

  async function newFactInput(e) {
    e.preventDefault();
    if (!changed) setChanged(true);
    setQuiz(quiz => ({...quiz,facts:quiz.facts.concat([{text:"",info:"",hint:""}])})); // rerender
    //document.getElementsByClassName("item")[document.getElementsByClassName("item").length-1].getElementsByClassName("itemtext")[0].focus();
    // requires a delay to focus on new itemtext element
    setTimeout(()=>document.getElementsByClassName("item")[document.getElementsByClassName("item").length-1].getElementsByClassName("itemtext")[0].focus(),100);
  }

  function deleteItem(id) {
    return e => {
      e.preventDefault();
      if (!changed) setChanged(true);
      setQuiz(quiz => ({...quiz,facts:quiz.facts.slice(0,id).concat(quiz.facts.slice(id+1))})); // rerender
    }
  }
  
  function handleSubmit(e) {
    e.preventDefault();

    setChanged(false);
    
    if (quiz.data.name && quiz.facts.every(fact => fact.text)) {
      if (localID === undefined) {
        dispatch(addQuiz(quiz)).then(navigate("/buildQuiz/local/"+quiz.length-1));
      } else dispatch(modifyQuiz({index:localID,quiz:quiz}));
    }
  }

  function saveQuiz() {
    const newQuiz = {
      data: {name: document.getElementById("quizBuilderTitle").value,
            description: document.getElementById("quizBuilderDescription").value,
            owner: quiz.data.owner},
      facts: []
    };
    for (const item of document.getElementsByClassName("item")) {
      const newItem = {
        text: item.getElementsByClassName("itemtext")[0].value,
        info: item.getElementsByClassName("iteminfo")[0].value,
        hint: item.getElementsByClassName("itemhint")[0].value};
      newQuiz.facts.push(newItem);
    }
    setQuiz(newQuiz);
    return newQuiz;
  }

  function deleteThisQuiz(e) {
    e.preventDefault();
    if (localID !== undefined) dispatch(deleteQuiz(localID));
    navigate("/");
  }

  function playThisQuiz(e) {
    e.preventDefault();
    if (!changed && quiz.data.name && quiz.facts.every(fact => fact.text)) {
      saveQuiz();
      if (localID !== undefined) {
        dispatch(modifyQuiz({index:localID,quiz:quiz}));
        navigate("/quiz/local/"+localID);
      } else {
        dispatch(addQuiz(quiz));
        navigate("/quiz/local/"+(localQuizzes.length-1)); // a new quiz created, user still on the new quiz page (no localID parameter), the quiz will be found here
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={deleteThisQuiz}>DELETE QUIZ</button>
      <button onClick={playThisQuiz} disabled={changed}>PLAY QUIZ</button>
      <br />
      <label htmlFor="quizBuilderTitle" className="mainLabel">Quiz Title:</label>
      <input type="text" id="quizBuilderTitle" onChange={changeHandler} value={quiz.data.name} required />
      <br />
      <label htmlFor="quizBuilderDescription" className="mainLabel">Description:</label>
      <input type="text" id="quizBuilderDescription" onChange={changeHandler} value={quiz.data.description} />
      <div id="items">
        <h3>Items:</h3>
        {quiz.facts.map((item,i) => <QuizBuilderItem key={"quizBuilderItem"+i} id={i} item={item} changeHandler={changeHandler} deleteItem={deleteItem} />)}
      </div>
      <button onClick={newFactInput}>new item</button>
      <input type="submit" value="SAVE" style={{background:changed ? "red" : "grey"}} disabled={!changed} />
    </form>
  );
}


export default QuizBuilder;