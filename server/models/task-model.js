const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Task = new Schema(
    {

        title: { type: String, required: true },
        description: { type: String, required: true },
        priority: { type: String, required: false },
        due_date: { type: Date, required: false },
        is_completed: { type: Boolean, required: false },
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('tasks', Task)