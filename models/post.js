const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: false, required: true }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
