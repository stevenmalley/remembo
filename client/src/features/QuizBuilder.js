import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addLocalQuiz, modifyLocalQuiz, deleteLocalQuiz, selectLocalQuizzes } from '../store/localQuizzes';
import { addPrivateQuiz, modifyPrivateQuiz, deletePrivateQuiz } from '../store/privateQuizzes';
import { selectAuth } from '../store/auth';
import QuizBuilderItem from './QuizBuilderItem';
import fetcher from '../fetcher';
import './QuizBuilder.css';


function QuizBuilder() {
  
  const navigate = useNavigate();
  const { localID, quizID } = useParams();
  const auth = useSelector(selectAuth);
  const username = auth.login ? auth.username : "me";
  const localQuizzes = useSelector(selectLocalQuizzes);
  const [ quiz, setQuiz ] = useState({data:{name:"",description:"",owner:username},facts:[{text:"",info:"",hint:""}]});
  const [ changed, setChanged ] = useState(false);

  async function getQuiz() {
    const response = await fetcher("/quiz/"+quizID,
      {method: "GET", credentials:"include", headers: {"Content-Type":"application/json", "Connection": "keep-alive"}}); // send cookie when retrieving a private quiz
    const jsonResponse = await response.json();
    if (jsonResponse.message !== "private quiz") setQuiz(jsonResponse);
  }
  
  useEffect(()=>{
    if (auth.login) {
      if (quizID !== undefined) {
        getQuiz();
      }
    } else if (localQuizzes[localID]) setQuiz(localQuizzes[localID]);
  },[auth,localQuizzes]);
  
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
  
  async function handleSubmit(e) {
    e.preventDefault();

    setChanged(false);
    
    if (quiz.data.name && quiz.facts.every(fact => fact.text)) {
      if (auth.login) {
        if (quizID === undefined) {
          const newQuizID = await dispatch(addPrivateQuiz(quiz));
          navigate("/buildQuiz/"+newQuizID);
        } else {
          dispatch(modifyPrivateQuiz(quiz));
        }
      } else {
        if (localID === undefined) {
          navigate("local/"+localQuizzes.length)
          dispatch(addLocalQuiz(quiz));
        } else dispatch(modifyLocalQuiz({index:localID,quiz:quiz}));
      }
    }
  }

  function saveQuiz() {
    const newQuiz = {
      data: {id: quiz.data.id, // undefined for local quizzes, value provided by server for private quizzes
            name: document.getElementById("quizBuilderTitle").value,
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
    if (quizID !== undefined) dispatch(deletePrivateQuiz(quiz))
    else if (localID !== undefined) dispatch(deleteLocalQuiz(localID));
    navigate("/");
  }

  function playThisQuiz(e) {
    e.preventDefault();
    if (!changed && quiz.data.name && quiz.facts.every(fact => fact.text)) {
      if (auth.login) navigate("/quiz/"+quiz.data.id);
      else navigate("/quiz/local/"+localID);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={deleteThisQuiz}>DELETE LIST</button>
      <button onClick={playThisQuiz} disabled={changed}>PLAY LIST</button>
      <br />
      <label htmlFor="quizBuilderTitle" className="mainLabel">List Title:</label>
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