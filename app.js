require('dotenv').config()

const express = require('express')
const { logger } = require('./middleware/logger.js')
const mongoose = require('mongoose')
const Post = require('./models/post.js')
const session = require('express-session')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use('/blog', express.static('public'))
app.use(logger)

app.use((request, response, next) => {
    response.locals.isAdmin = request.session.isAdmin || false
    next()
})

const requireAdmin = (request, response, next) => {
    if(!request.session.isAdmin) return response.redirect('/admin/login')
    next()
}

app.get('/', (request, response) => {
    response.render('index')
})

app.get('/about', (request, response) => {
    response.sendFile('about.html', { root: 'public' })
})

app.get('/posts/new', requireAdmin, (request, response) => {
    response.render('posts/new')
})

app.get('/posts', async (request, response) => {
    try {
        const posts = await Post.find({ isPublished: true }).exec()
        response.render('posts/index', { posts: posts })
    } catch(error) {
        console.error(error)
        response.render('posts/index', { posts: [] })
    }
})

app.get('/posts/:slug/edit', requireAdmin, async (request, response) => {
    try {
        const slug = request.params.slug
        const post = await Post.findOne({ slug: slug }).exec()
        if(!post) throw new Error('Post not found')
        response.render('posts/edit', { post: post })
    } catch(error) {
        console.error(error)
        response.status(404).send('Could not find the post you\'re looking for.')
    }
})

app.get('/posts/:slug/delete', requireAdmin, async (request, response) => {
    try {
        await Post.findOneAndDelete({ slug: request.params.slug })
        response.redirect('/posts')
    } catch(error) {
        console.error(error)
        response.send('Error: The post could not be deleted.')
    }
})

app.get('/posts/:slug', async (request, response) => {
    try {
        const slug = request.params.slug
        const post = await Post.findOne({ slug: slug }).exec()
        if(!post) throw new Error('Post not found')
        response.render('posts/show', { post: post })
    } catch(error) {
        console.error(error)
        response.status(404).send('Could not find the post you\'re looking for.')
    }
})

app.get('/contact', (request, response) => {
    response.sendFile('contact.html', { root: 'public' })
})

app.post('/contact', (request, response) => {
    console.log('Contact form submission: ', request.body)
    response.sendFile('thankyou.html', { root: 'public' })
})

app.post('/posts', requireAdmin, async (request, response) => {
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

app.post('/posts/:slug', requireAdmin, async (request, response) => {
    try {
        const post = await Post.findOneAndUpdate(
            { slug: request.params.slug },
            {
                title: request.body.title,
                slug: request.body.slug,
                description: request.body.description,
                content: request.body.content,
                isPublished: request.body.isPublished === 'true'
            },
            { new: true }
        )
        response.redirect(`/posts/${post.slug}`)
    } catch(error) {
        console.error(error)
        response.send('Error: The post could not be updated.')
    }
})

app.get('/admin/login', (request, response) => {
    response.render('admin/login', { error: null })
})

app.post('/admin/login', (request, response) => {
    if(request.body.password === process.env.ADMIN_PASSWORD) {
        request.session.isAdmin = true
        response.redirect('/admin')
    } else {
        response.render('admin/login', { error: 'Wrong password, try again!' })
    }
})

app.get('/admin', requireAdmin, (request, response) => {
    response.render('admin/index')
})

app.get('/admin/logout', (request, response) => {
    request.session.destroy()
    response.redirect('/admin/login')
})

app.listen(process.env.PORT, () => {
    console.log(`Started server on port ${process.env.PORT}`)
})
