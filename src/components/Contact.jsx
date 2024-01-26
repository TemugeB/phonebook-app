
//Display the filter box
const FilterEntry = ({onChange}) => {
    return (<div>Filter Phone book <input onChange={onChange}/> </div>)
  }

//Display single line of phonebook entry
const PhoneNumber = ({person, onDelete}) => {
    return (<div>{person.name} : {person.number} <button onClick={onDelete}>Delete</button> </div>)
  }

//Display the whole phone book
const Phonebook = ({persons, deleteEntryTemplate}) => {
    return (<div> {persons.map(person => <PhoneNumber key={person.id} person={person} onDelete={() => deleteEntryTemplate(person)}/>)} </div>)
}

//Display the new name and phonenumber form
const EntryForm = ({handleSubmit, handleNameChange, handleNumberChange}) => {
    return (
        <form onSubmit={handleSubmit}>
        <div> Name: <input onChange={handleNameChange}/></div>
        <div> Number: <input onChange={handleNumberChange}/></div>
        <div>
        <button type="submit">add</button>
        </div>
    </form>
    )
}

export {FilterEntry, PhoneNumber, Phonebook, EntryForm}