const express = require('express')
const { getTaskById, updateTask, deleteTask, getTasks, createTask, updateTaskCompletion } = require('../controller/taskController')

//const taskController = require('../controllers/taskController')

const router = express.Router()

router.post('/task', createTask)
router.put('/task/:id', updateTask)
router.delete('/task/:id', deleteTask)
router.get('/task/:id', getTaskById)
router.get('/task', getTasks)
router.post('/task/completion/:id', updateTaskCompletion)

module.exports = router