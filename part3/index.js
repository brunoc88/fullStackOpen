require('dotenv').config() //important to .env that contain the URI

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');


app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));



morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));




app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(person => {
      res.json(person);
    })
    .catch(err => {
      console.log(err);
    })
})

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const infoPersons = persons.length;
      const date = new Date();
      res.send(`<p>Phonebook has info for ${infoPersons} people</p>
      <p>${date}</p>`)
    })
})


app.get('/api/persons/:id',(req,res)=>{
  const id = req.params.id;
  Person.findById(id)
  .then(person=>{
    if(person){
      res.json(person)
    }else{
      res.status(404).end();
    }
  })
  .catch(err=>console.log(err));
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(person => {
      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }
      res.status(204).end(); 
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.post('/api/persons',(req,res)=>{
  const {name, number} = req.body;
  if(!name || !number){
    res.status(400).json({ error: 'content missing' });
  }
  const person = new Person({
    name: name,
    number: number
  })

  person.save()
  .then(savedPerson=>{
    res.json(savedPerson);
  })
  .catch(err=>{
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  })
})


app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    id,
    { name, number }, 
    { new: true, runValidators: true } 
  )
  .then(updatedPerson => {
    if (!updatedPerson) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(updatedPerson);
  })
  .catch(error => {
    console.error(error);
    res.status(400).json({ error: "Invalid ID format or bad request" });
  });
});


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})