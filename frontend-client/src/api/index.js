import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8001/api',
})

export const addTask = payload => api.post(`/task`, payload)
export const getAllTask = () => api.get(`/task`)
export const updateTaskById = (id, payload) => api.put(`/task/${id}`, payload)
export const deleteTaskById = id => api.delete(`/task/${id}`)
export const getTaskById = id => api.get(`/task/${id}`)
export const toggleTaskCompletion = (id,payload) => api.put(`/task/completion/${id}`, payload)

const apis = {
    addTask,
    getAllTask,
    updateTaskById,
    deleteTaskById,
    getTaskById,
    toggleTaskCompletion
}

export default apis