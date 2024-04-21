const mongoose = require('mongoose')

// Todo: put in an .env
mongoose
    .connect('mongodb://mongo:27017/tasks', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db