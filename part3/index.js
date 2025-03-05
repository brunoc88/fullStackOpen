const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');


app.use(express.static('dist')); 
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));



//3.8
// Crear un token personalizado para registrar el cuerpo de las peticiones POST
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''; 
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


//3.1
app.get('/api/persons',(req,res)=>{
    return res.status(200).json(persons);
})
//3.2
app.get('/info', (req, res) => {
    const infoPersons = persons.length; 
    const date = new Date();
    
    res.status(200).send(`
        <p>Phonebook has info for ${infoPersons} people</p>
        <p>${date}</p>
    `);
});

//3.3

app.get('/api/persons/:id',(req,res)=>{
    
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(p => p.id === id)
    console.log(person)
    if (person) {
        res.json(person)
    } else {
        res.status(404).json({ error: 'Person not found' })
    }
})

//3.4

app.delete('/api/persons/:id',(req,res)=>{
  const id = Number(req.params.id);
  persons = persons.filter(p=> p.id !== id);

  res.status(204).end()
})

//3.5 - 3.6

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name & number are required!' });
  }
  const nameExist = persons.find(person => person.name === body.name);
  const numberExist = persons.find(person => person.number === body.number);
  if(numberExist && nameExist){
    return res.status(409).json({ error: 'Values duplicated!' });
  }
  
  if (numberExist) {
    return res.status(409).json({ error: 'number must be unique' });
  }

  if (nameExist) {
    return res.status(409).json({ error: 'name must be unique' });
  }

  let id;
  do {
    id = Math.floor(Math.random() * 1000000);
  } while (persons.some(person => person.id === id));

  const person = {
    id,
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  return res.status(201).json(person);
});




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})