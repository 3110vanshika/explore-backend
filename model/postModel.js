const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    tags: [{
        type: String,
        trim: true, 
    }],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});


module.exports = mongoose.model('BlogPost', blogPostSchema);
