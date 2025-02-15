import { useState } from 'react'
import { Persons, PersonForm, Filter } from './components/components'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');



  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );


  const addName = (event) => {
    event.preventDefault();
    const duplicateName = persons.find(value => value.name === newName);
    const duplicateNumber = persons.find(value => value.number === newNumber);

    if (!newName.trim() || !newNumber.trim()) {
      alert("Both name and number must be filled out!");
      return;
    }

    if (duplicateName) {
      alert(`${newName} is already added to phonebook`);
      setNewName('');
      return
    }

    if (duplicateNumber) {
      alert(`this number: ${newNumber} is already added to phonebook`);
      setNewNumber('');
      return
    }
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(newPerson));
    setNewName('');
    setNewNumber('');
  }



  return (
    <div>
      <h2>Phonebook</h2>

      <Filter changeFilter={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm changeName={handleNameChange} changeNumber={handleNumberChange}
        addPerson={addName} newName={newName}
        newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons personFilter={filteredPersons} />
    </div>
  )
}


export default App
