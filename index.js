const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(cors())
app.use(morgan())
app.use(requestLogger)


// step 1
let phonebook = [
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
  },
  {
    "id": 5,
    "name": "Alan Turing",
    "number": "20 3862 3352"
  }
]


app.get('/', (req, res) => {
  res.send('<h1>hello world. enter /api/persons in the url to get the phonebook</h1>')
})

// step 1
app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

// step 2
app.get('/info', (req, res) => {
  let data = `Phonebok has info of ${phonebook.length} people. ${new Date()}`;
  res.send(data)
})

// step 3
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = phonebook.find(phone => phone.id === id)

   if (person) {
    res.json(person)
   } else {
    res.statusMessage = 'wrong number'
    res.send('id not found')
    res.status(404).end()
   }
})

// step 4
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  phonebook = phonebook.filter(person => person.id !== id)

  res.status(204).end()
})

// step 5
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post('/api/persons', (req, res) => {
const body = req.body

if (!body.name || !body.number) {
  return res.status(400).json({
    error: 'Name or number is missing'
  })
}
let f = phonebook.find(person => person.name === body.name)

if (f) {
  return res.status(400).json({
    error: 'name must be unique'
  })
}

const person = {
  name: body.name,
  number: body.number,
  id: getRandomArbitrary(1, 1000000)
}
phonebook.push(person)
res.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})