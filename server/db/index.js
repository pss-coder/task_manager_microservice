const mongoose = require('mongoose')

// Todo: put in an .env
mongoose
    .connect('mongodb://localhost:55000/tasks', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db