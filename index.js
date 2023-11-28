require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const custom = morgan((tokens, req, res) => {
    report = [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
      ]
    if (tokens.method(req, res) === "POST") {
        report = report.concat(JSON.stringify(req.body))
    }
    return report.join(' ')
  })

app.use(custom)

let persons = [
    {
      id: 1,
      name: "One",
      number: "111-111-111"
    },
    {
      id: 2,
      name: "Two",
      number: "222-222-222"
    },
    {
      id: 3,
      name: "Three",
      number: "333-333-333"
    }
  ]

// app.get('/api/persons', (req, res) => {
//     res.json(persons)
// })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (req, res) => {
    const content = `<div><p>Phonebook has info for ${persons.length} people </p><p>${Date()}</p></div>`
    res.send(content)
})


app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    console.log(person)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// app.post('/api/persons', (request, response) => {
//     const body = request.body
  
//     if (!body.name) {
//       return response.status(400).json({ 
//         error: 'name missing' 
//       })
//     }
//     if (!body.number) {
//         return response.status(400).json({ 
//           error: 'number missing' 
//         })
//     }
//     if (persons.map(person => person.name).includes(body.name)) {
//         return response.status(400).json({ 
//           error: `A number for a person named '${body.name}' aready exists in the phonebook` 
//         })
//     } 

//     const person = {
//       name: body.name,
//       number: body.number,
//       id: Math.floor(Math.random()*10**9),
//     }
  
//     persons = persons.concat(person)
  
//     response.json(persons)
// })
app.post('/api/persons', (request, response) => {
  const body = request.body

  // if (body.content === undefined) {
  //   return response.status(400).json({ error: 'content missing' })
  // }
  console.log(body)
  const person = new Person({
    name: body.name,
    number: body.number
  })
  console.log(person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})