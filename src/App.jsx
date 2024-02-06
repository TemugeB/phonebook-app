import { useState, useEffect } from 'react'
import phonebookServices from './services/Contacts'
import {FilterEntry, Phonebook, EntryForm} from './components/Contact'
import Notification from './components/Notification'

const App = () => {
  
  //create states
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterVal, setFilterVal] = useState('')
  const [AlertMessage, setAlertMessage] = useState([null, false])

  //read phonebook from server
  useEffect(() => {
    phonebookServices
      .getAll()
      .then(persons => setPersons(persons))
      .catch( error => console.log('Unable to get the phonebook from server', error))
  }, [])


  //handle new phonebook entry
  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)){
      //Ask to update the phone number
      if (window.confirm(`${newName} already exists in the phonebook. Update with new phone number?`) === false){
        return
      }

      const personToUpdate = persons.find(p => p.name === newName)
      const updatedPerson = {...personToUpdate, number:newNumber}
      phonebookServices
        .update(updatedPerson.id, updatedPerson)
        .then(respondedPerson => {
          setPersons(persons.map(p => p.id !== respondedPerson.id ? p: respondedPerson))
          setAlertMessage([`Updated contact info of '${respondedPerson.name}'`, false])
          setTimeout(() => setAlertMessage([null, false]), 3000)
        })
        .catch(error => {
          console.log('unable to update phone number: ', error)
          setAlertMessage([error.response.data.error, true])
          setTimeout(()=> {setAlertMessage([null, false])}, 3000)
        })
      return
    }

    const newPerson = {
      name : newName,
      number : newNumber,
    }

    phonebookServices
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setAlertMessage([`Added contact info for '${returnedPerson.name}'`, false])
        setTimeout(() => {setAlertMessage([null, false])}, 3000)
      })
      .catch(error => {
        console.log('unable to add new entry:', error)
        setAlertMessage([error.response.data.error, true])
        setTimeout(() => {setAlertMessage([null, false])}, 3000)
      })
  }


  //handle phonebook entry delete
  const handleEntryDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)){
      phonebookServices
      .delete_entry(person.id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id))
        setAlertMessage([`Deleted phonebook entry for '${person.name}'`, false])
        setTimeout(() => setAlertMessage([null, false]), 3000)
      })
      .catch(() => {
        console.log('Unable to delete entry')
        setAlertMessage([`Information of ${person.name} is already removed from server`, true])
        setTimeout(() => {setAlertMessage([null, false])}, 3000)
      })
    }
  }

  //handlers for state changes
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilterVal(event.target.value)

  //create a list of people to show due to filtering
  const personsToShow = filterVal === '' ? persons :  persons.filter(person => person.name.toLowerCase().includes(filterVal))

  return (
    <div>
      <h2>Phonebook</h2>
        <FilterEntry onChange={handleFilterChange} />

      <h2>Add new entry</h2>
        <EntryForm handleSubmit={handleSubmit} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
        <Notification message={AlertMessage} />

      <h2>Numbers</h2>
        <Phonebook persons = {personsToShow} deleteEntryTemplate={handleEntryDelete}/>
    </div>
  )
}

export default App