import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addQuiz, modifyQuiz, selectLocalQuizzes } from '../store/localQuizzes';
import QuizBuilderItem from './QuizBuilderItem';
import './QuizBuilder.css';


function QuizBuilder() {
  
  const { localID } = useParams();
  const localQuizzes = useSelector(selectLocalQuizzes);
  const thisQuiz = localQuizzes[localID] || {data:{name:"",description:"",owner:""},facts:[{text:"",info:"",hint:""}]};
  const [ quiz, setQuiz ] = useState(thisQuiz);
  
  const dispatch = useDispatch();

  function changeQuizTitle(e) {
    setQuiz({...quiz,data:{...quiz.data,name:e.target.value}});
  }

  function changeQuizDescription(e) {
    setQuiz({...quiz,data:{...quiz.data,description:e.target.value}});
  }

  function changeHandler(e) {
    const category = e.target.id.slice(0,4);
    const itemID = Number(e.target.id.slice(4));
    quiz.facts[itemID][category] = e.target.value;
    setQuiz({...quiz,facts:quiz.facts}); // rerender
  }

  function deleteItem(id) {
    return e => {
      e.preventDefault();
      console.log(id);
      quiz.facts = quiz.facts.slice(0,id).concat(quiz.facts.slice(id+1));
      setQuiz({...quiz,facts:quiz.facts}); // rerender
    }
  }
  
  function handleSubmit(e) {
    e.preventDefault();

    console.log(quiz);
    if (localID === undefined) dispatch(addQuiz(quiz));
    else dispatch(modifyQuiz({index:localID,quiz:quiz}));
  }

  function newFactInput(e) {
    e.preventDefault();

    setQuiz({...quiz,facts:quiz.facts.concat([{text:"",info:"",hint:""}])});
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="quizBuilderTitle">Quiz Title:</label><input type="text" id="quizBuilderTitle" onChange={changeQuizTitle} value={quiz.data.name} required />
      <br />
      <label htmlFor="quizBuilderDescription">Description:</label><input type="text" id="quizBuilderDescription" onChange={changeQuizDescription} value={quiz.data.description} />
      <div id="items">
        <h3>Items:</h3>
        {quiz.facts.map((item,i) => <QuizBuilderItem key={"quizBuilderItem"+i} id={i} item={item} changeHandler={changeHandler} deleteItem={deleteItem} />)}
      </div>
      <button onClick={newFactInput}>new item</button>
      <input type="submit" value="SAVE" />
    </form>
  );
}


export default QuizBuilder;