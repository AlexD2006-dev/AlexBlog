const express = require('express')
const { logger } = require('./middleware/logger.js')
const mongoose = require('mongoose')
const Post = require('./models/post.js')

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/alexblog')
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

const PORT = 3000

const posts = [
    { title: 'My First Post', slug: 'my-first-post', description: 'This is my very first blog post!', isPublished: true },
    { title: 'Griffindor & Coding', slug: 'griffindor-and-coding', description: 'What Griffindor house taught me about programming.', isPublished: true },
    { title: 'Draft Post', slug: 'draft-post', description: 'Still working on this one...', isPublished: false }
]

app.use('/blog', express.static('public'))
app.use(logger)

app.get('/', (request, response) => {
    response.render('index')
})

app.get('/about', (request, response) => {
    response.sendFile('about.html', { root: 'public' })
})

app.get('/posts', (request, response) => {
    response.render('posts/index', { posts: posts })
})

app.get('/posts/new', (request, response) => {
    response.render('posts/new')
})

app.post('/posts', async (request, response) => {
    try {
        const post = new Post({
            title: request.body.title,
            slug: request.body.slug,
            description: request.body.description,
            content: request.body.content,
            isPublished: request.body.isPublished === 'true'
        })
        await post.save()
        response.redirect('/posts')
    } catch (error) {
        console.error(error)
        response.send('Error: The post could not be created.')
    }
})

app.get('/contact', (request, response) => {
    response.sendFile('contact.html', { root: 'public' })
})

app.get('/posts/:slug', (request, response) => {
    const slug = request.params.slug
    const post = posts.find(p => p.slug === slug)

    if (!post) {
        return response.status(404).send('Post not found')
    }

    response.render('posts/show', { post: post })
})

app.post('/contact', (request, response) => {
    console.log('Contact form submission: ', request.body)
    response.sendFile('thankyou.html', { root: 'public' })
})

app.post('/posts', async (request, response) => {
    try {
        const post = new Post({
            title: request.body.title,
            slug: request.body.slug,
            description: request.body.description,
            content: request.body.content,
            isPublished: request.body.isPublished === 'true'
        })
        await post.save()
        response.redirect('/posts')
    } catch (error) {
        console.error(error)
        response.send('Error: The post could not be created.')
    }
})


app.listen(PORT, () => {
    console.log(`Started server on port ${PORT}`)
})
