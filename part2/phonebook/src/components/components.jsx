
const Persons = ({ personFilter, click }) => {
    return (
        <div>
            {personFilter.map(value => (
                <div key={value.id}>
                    <p>{value.name} {value.number}
                    <button onClick={() => click(value.id, value.name)}>delete</button>
                    </p>
                </div>
            ))}
        </div>
    );
}


const PersonForm = ({changeName, changeNumber, addPerson, newName, newNumber}) => {
    return (
        <form onSubmit={addPerson}>
            <div>name: <input onChange={changeName} value={newName}/></div>
            <div>number: <input onChange={changeNumber} value={newNumber}/></div>
            <div><button type="submit">add</button></div>
        </form>
    )
}

const Filter = ({changeFilter}) =>{
    return(
       <div>filter shown with <input onChange={changeFilter}/></div>
    )
}

const Notification = ({ message, errorMessage }) => {
    if (!message && !errorMessage) {
        return null;
    }
    
    if(errorMessage){
        return(
            <div className="error">
                {errorMessage}
            </div>
        )
    }

    return (
      <div className="success">
        {message}
      </div>
    )
}
export { Persons, PersonForm, Filter, Notification };
