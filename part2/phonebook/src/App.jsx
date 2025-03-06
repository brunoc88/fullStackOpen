import { useState, useEffect } from 'react'
import { Persons, PersonForm, Filter, Notification } from './components/components'
import { getAll, create, deletePerson, updatePhoneNumber } from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [successMessage, setSuccesMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    getAll()
      .then(prev => setPersons(prev))
      .catch(e => {
        console.log(e);
      })
  }, [])

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
    const findPerson = persons.find(value => value.name === newName);
    const duplicateNumber = persons.find(value => value.number === newNumber);

    if (!newName.trim() || !newNumber.trim()) {
      alert("Both name and number must be filled out!");
      return;
    }

    if (findPerson) {
      if (findPerson.number !== newNumber) {
        
        const numberInUse = persons.find(value => value.number === newNumber && value.id !== findPerson.id);

        if (numberInUse) {
          alert(`This number: ${newNumber} is already assigned to ${numberInUse.name}.`);
          setNewNumber('');
          return;
        }

        const msj = `${newName} is already added to phonebook, replace the old number with a new one?`;
        if (window.confirm(msj)) {
          const updatedPerson = { ...findPerson, number: newNumber };

          updatePhoneNumber(findPerson.id, updatedPerson)
            .then((updated) => {
              setPersons(persons.map(person => person.id !== updated.id ? person : updated));
              setNewName('');
              setNewNumber('');
              setSuccesMessage(`Updated ${updated.name}`);
              setTimeout(() => {
                setSuccesMessage(null);
              }, 2000);
            })
            .catch((error) => {
              console.error(error);
              setErrorMessage(`Information of ${newName} has already been removed from the server.`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 2000);
              setPersons(persons.filter(person => person.id !== findPerson.id));
            });
        }
        return;
      }
    }

    if (duplicateNumber) {
      alert(`This number: ${newNumber} is already added to phonebook`);
      setNewNumber('');
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    create(newPerson)
      .then(prev => {
        setPersons(persons.concat(prev));
        setNewName('');
        setNewNumber('');
        setSuccesMessage(`Added ${prev.name}`);
        setTimeout(() => {
          setSuccesMessage(null);
        }, 2000);
      })
      .catch(error => {
        console.error(error);
        setErrorMessage(`Failed to add ${newPerson.name}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      });      
  }

  const destroyPerson = (id, name) => {
    const msj = `Delete ${name}?`;
    if (window.confirm(msj)) {
      deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error("Error deleting person:", error);
          setErrorMessage(`Failed to delete ${name}`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={successMessage} errorMessage={errorMessage} />
      <Filter changeFilter={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm changeName={handleNameChange} changeNumber={handleNumberChange}
        addPerson={addName} newName={newName}
        newNumber={newNumber} />

      <h3>Numbers</h3>
      <Persons personFilter={filteredPersons} click={destroyPerson} />
    </div>
  )
}

export default App
