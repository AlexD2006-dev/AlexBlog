const express = require('express')
const { logger } = require('./middleware/logger.js')

const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
const PORT = 3000

app.use('/blog', express.static('public'))

app.use(logger)

app.get('/', (request, response) => {
    response.render('index')
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

app.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.sendFile('thankyou.html', {root: 'public'})
})

app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`)
})