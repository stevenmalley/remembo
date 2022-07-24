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
  const dispatch = useDispatch();
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

  function changeHandler(e) {
    if (!changed) setChanged(true);
    saveQuiz();
  }

  async function newFactInput(e) {
    e.preventDefault();
    if (!changed) setChanged(true);
    await setQuiz(quiz => ({...quiz,facts:quiz.facts.concat([{text:"",info:"",hint:""}])})); // rerender
    document.getElementsByClassName("item")[document.getElementsByClassName("item").length-1].getElementsByClassName("itemtext")[0].focus();
  }

  function deleteItem(id) {
    return e => {
      e.preventDefault();
      if (quiz.facts.length > 1) {
        if (!changed) setChanged(true);
        setQuiz(quiz => ({...quiz,facts:quiz.facts.slice(0,id).concat(quiz.facts.slice(id+1))})); // rerender
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
  }
  
  async function handleSubmit(e) {
    e.preventDefault();

    setChanged(false);
    
    if (quiz.data.name && quiz.facts.length > 0 && quiz.facts.every(fact => fact.text)) {
      if (auth.login) {
        if (quizID === undefined) { // logged in; new and unsaved quiz
          const newQuizID = await dispatch(addPrivateQuiz(quiz));
          setQuiz({...quiz,data:{...quiz.data,id:newQuizID}});
          navigate("/buildQuiz/"+newQuizID);
        } else { // logged in; modifying a saved quiz
          dispatch(modifyPrivateQuiz(quiz));
        }
      } else {
        if (localID === undefined) { // not logged in; new and unsaved quiz
          dispatch(addLocalQuiz(quiz));
          navigate("/buildQuiz/local/"+(JSON.parse(localStorage.getItem("localQuizzes")).length-1));
        } else { // not logged in; modifying a locally saved quiz
          dispatch(modifyLocalQuiz({index:localID,quiz:quiz}));
        }
      }
    }
  }

  async function saveQuiz() {
    const newQuiz = {
      data: {id: quizID, // undefined for local quizzes, value provided by server for private quizzes
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
    await setQuiz(newQuiz);
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
    if (!changed && quiz.data.name && quiz.facts.length > 0 && quiz.facts.every(fact => fact.text)) {
      if (auth.login && quizID !== undefined) navigate("/quiz/"+quizID);
      else if (localID !== undefined) navigate("/quiz/local/"+localID);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button onClick={deleteThisQuiz} className="buildQuizTopButton" type="button">DELETE LIST</button>
      <button onClick={playThisQuiz} disabled={changed} className="buildQuizTopButton" type="button">PLAY LIST</button>
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
      <button onClick={newFactInput} type="button">new item</button>
      <button type="submit" style={{background:changed ? "red" : "grey"}} disabled={!changed}>SAVE</button>
    </form>
  );
}


export default QuizBuilder;