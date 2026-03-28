const express = require('express')
const { logger } = require('./middleware/logger.js')

const app = express()
const PORT = 3000

app.use('/blog', express.static('public'))

app.use(logger)

app.get('/', (request, response) => {
    response.send("Welcome to Alex' Blog")
})

app.get('/about', (request, response) => {
    response.sendFile('about.html', { root: 'public'})
})

app.get('/posts', (request, response) => {
  response.sendFile('posts.html', { root: 'public'})
})

app.get('/contact', (request, response) => {
  response.sendFile('contact.html', { root: 'public'})
})

app.get('/posts/:slug', (request, response) => {
    const slug = request.params.slug

    response.send(`You chose the post with the ID of ${slug}`)
})

app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`)
})