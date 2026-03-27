const express = require('express')
const { logger } = require('./middleware/logger.js')

const app = express()
const PORT = 3000

app.use(logger)

app.get('/', (request, response) => {
    response.send("Welcome to Alex' Blog")
})

app.get('/about', (request, response) => {
    response.send("About me and my blog")
})

app.get('/posts', (request, response) => {
  response.send('All blog posts')
})

app.get('/contact', (request, response) => {
  response.send('Reach out to us if you have any questions.')
})

app.get('/posts/:slug', (request, response) => {
    const slug = request.params.slug

    response.send(`You chose the post with the ID of ${slug}`)
})

app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`)
})