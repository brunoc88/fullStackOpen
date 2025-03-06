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




app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(person => {
      res.json(person);
    })
    .catch(error => {
      next.log(error);
    })
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      const infoPersons = persons.length;
      const date = new Date();
      res.send(`<p>Phonebook has info for ${infoPersons} people</p>
      <p>${date}</p>`)
    })
    .catch(error => next(error));
})


app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    res.status(400).json({ error: 'content missing' });
  }
  const person = new Person({
    name: name,
    number: number
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})