const Task = require('../models/task-model')

createTask = (req, res) => {
    const body = req.body
    //console.log(body)
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a task',
        })
    }

    
    const task = new Task(body)

    if (!task) {
        return res.status(400).json({ success: false, error: err })
    }

    task
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: task._id,
                message: 'Task created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Task not created!',
            })
        })
}

updateTask = async (req, res) => {
    try {
        const updatedItem = await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        if (!updatedItem) {
          return res.status(404).json({ success: true,  message: 'Task not found' });
        }

        return res.status(200).json({
        success: true,
        id: updatedItem._id,
        message: 'Task updated!',})

      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

updateTaskCompletion = async (req, res) => {
  console.log(req.body)
    try {
        const updatedItem = await Task.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        if (!updatedItem) {
          return res.status(404).json({ success: true,  message: 'Task Completion not found' });
        }

        return res.status(200).json({
        success: true,
        id: updatedItem._id,
        message: 'Task Completion updated!',})

      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

deleteTask = async (req, res) => {
    try {
        const deletedItem = await Task.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
          return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully', data: deletedItem });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
}

getTaskById = async (req, res) => {
    try {
        const item = await Task.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ success: false, message: 'Task not found' });
        }
        return res.status(200).json({ success: true, data: item })
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
}

getTasks = async (req, res) => {
    //console.log("getting tasks")
    try {
        const tasks = await Task.find()
        if (!tasks) {
            return res
                .status(404)
                .json({ success: false, error: `Tasks not found` })
        }
        return res.status(200).json({ success: true, data: tasks })
    }
    catch(err) {
        if (err) {
                return res.status(400).json({ success: false, error: err })
            }
    }
    return res.status(400).json({ success: false, error: err })
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    getTaskById,
    updateTaskCompletion
}