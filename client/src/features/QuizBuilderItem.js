export default function QuizBuilderItem(props) {
  // return (
  //   <div className="item">
  //     <label htmlFor={"text"+props.id} className="mainLabel">item {props.id+1}:</label>
  //     <input type="text" className="itemtext" id={"text"+props.id} name={"text"+props.id} onChange={props.changeHandler} value={props.item.text} required />
  //     <button onClick={props.deleteItem(props.id)} type="button">delete item</button>
  //     <br />
  //     <label htmlFor={"info"+props.id} className="mainLabel">extra info:</label>
  //     <input type="text" className="iteminfo" id={"info"+props.id} name={"info"+props.id} onChange={props.changeHandler} value={props.item.info} />
  //     <label htmlFor={"info"+props.id} className="optionalLabel">(optional)</label>
  //     <br />
  //     <label htmlFor={"hint"+props.id} className="mainLabel">hint:</label>
  //     <input type="text" className="itemhint" id={"hint"+props.id} name={"hint"+props.id} onChange={props.changeHandler} value={props.item.hint} />
  //     <label htmlFor={"hint"+props.id} className="optionalLabel">(optional)</label>
  //   </div>
  // );
  return (
      <table className="item">
        <tbody>
          <tr>
            <td><label htmlFor={"text"+props.id} className="mainLabel">item {props.id+1}:</label></td>
            <td><input type="text" className="itemtext" id={"text"+props.id} name={"text"+props.id} onChange={props.changeHandler} value={props.item.text} required /></td>
            <td><button onClick={props.deleteItem(props.id)} type="button">delete item</button></td>
          </tr>
          <tr>
            <td><label htmlFor={"info"+props.id} className="mainLabel">extra info:</label></td>
            <td><input type="text" className="iteminfo" id={"info"+props.id} name={"info"+props.id} onChange={props.changeHandler} value={props.item.info} /></td>
            <td><label htmlFor={"info"+props.id} className="optionalLabel">(optional)</label></td>
          </tr>
          <tr>
            <td><label htmlFor={"hint"+props.id} className="mainLabel">hint:</label></td>
            <td><input type="text" className="itemhint" id={"hint"+props.id} name={"hint"+props.id} onChange={props.changeHandler} value={props.item.hint} /></td>
            <td><label htmlFor={"hint"+props.id} className="optionalLabel">(optional)</label></td>
          </tr>
        </tbody>
      </table>
    );
}