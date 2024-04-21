import { useEffect, useState } from 'react';
// import Footer from './Footer'
import Header from './Header'
import CreateTaskDialog from './CreateTaskDialog';
import TaskCard from './TaskCard';
import SearchPalette from './SearchPalette';
import apis from '../api';

function dateConvert(date) {
console.log(date)
// Extract year, month, and day from the date object
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
const day = String(date.getDate()).padStart(2, '0');

// Combine year, month, and day into "yyyy-MM-dd" format
const formattedDate = `${year}-${month}-${day}`;

return formattedDate
}

export default function App() {


  const [navigation, setNavigation] = useState (
    [
      { name: 'All', href: '#', current: true, count: 0},
      { name: 'Upcoming', href: '#', current: false, count:0},
      { name: 'Overdue', href: '#', current: false, count:0 },
      { name: 'Completed', href: '#', current: false, count:0 },
    ]
  )
  const [tasks, setTasks] = useState([]);
  
  // GET ALL TASKS
  useEffect(() => {
    apis.getAllTask().then(response => {
      const data = response.data
      if (data.success) {
//        console.log(data.data)
        setTasks(data.data.map(task => {
          return {
            _id: task._id,
            title: task.title,
            description: task.description,

            due_date: dateConvert(new Date(task.due_date)), // date

            priority: task.priority,
            is_completed: task.is_completed
          }
        }))
      } else {
        setTasks([])
      }
      
    })
  }, [])

  const [isSearch, setIsSearch] = useState(false)

  // for adding task
  const [isCreateTaskOpen, SetIsCreateTaskOpen] = useState(false)

  const [filteredTasks, setFilteredTasks] = useState([]); // State to hold filtered tasks

  // based on sections
  const [filterOption, setFilterOption] = useState('All'); // State to hold the current filter option


  const [priorityFilter, setPriorityFilter] = useState('All'); // State for priority filter

  const [specificDate, setSpecificDate] = useState(""); // State for specific date filter

  // Function to filter tasks based on the selected option
  useEffect(() => {
    let updatedTasks = tasks;

    if (filterOption === 'Completed') {
      updatedTasks = tasks.filter(task => task.is_completed);
    } else if (filterOption === 'Overdue') {
      const today = new Date();
      updatedTasks = tasks.filter(task => new Date(task.due_date) < today);
    } else if (filterOption === 'Upcoming') {
      const today = new Date();
      updatedTasks = tasks.filter(task => new Date(task.due_date) >= today);
    }

    if (priorityFilter !== 'All') {
      updatedTasks = updatedTasks.filter(task => task.priority === priorityFilter.toLowerCase());
    }

    if (specificDate) {
      console.log(specificDate)
      updatedTasks = updatedTasks.filter(task => {
        const dueDate = new Date(task.due_date);
        return dueDate.toDateString() === new Date(specificDate).toDateString();
      });
    }

    setFilteredTasks(updatedTasks);
  }, [tasks, filterOption, priorityFilter, specificDate]);


  useEffect(() => {
    const counts = {
      All: tasks.length,
      Completed: tasks.filter(task => task.is_completed).length,
      Overdue: tasks.filter(task => {
        const today = new Date();
        return new Date(task.due_date) < today;
      }).length,
      Upcoming: tasks.filter(task => {
        const today = new Date();
        return new Date(task.due_date) >= today;
      }).length,
    };
    setNavigation(prevNavigation =>
      prevNavigation.map(item => ({
        ...item,
        count: counts[item.name]
      }))
    );

  }, [tasks]);

  function addTask(newTask) {

    apis.addTask(newTask).then(res => {
      
      if (res.data.success) {
        console.log("task added")
        setTasks(prevTasks => {
          return [...prevTasks, newTask];
        });
      } else {
        alert("Failed to add Task, please ensure you are have a working network connection.")
      }
    })
    SetIsCreateTaskOpen(false)
  }

  function editTask(id, edittedTask) {

    console.log(id)
    console.log(edittedTask)

    apis.updateTaskById(id,edittedTask).then(res => {
      if (res.data.success) {
        console.log("task updated succesfully")
          setTasks((prevTasks) =>
          prevTasks.map((task, i) => {
            if (task._id === id) {
              return edittedTask;
            }
            return task;
          })
        );
      } else {
        alert("Failed to edit Task, please ensure you are have a working network connection.")
      }
    })

    
  }


  
  function deleteTask(id) {

    apis.deleteTaskById(id).then(response => {
      if (response.data.success) {
        console.log("task deleted")

        setTasks(prevTask => {
          return prevTask.filter((taskItem, index) => {
            return taskItem._id !== id;
          });
        });

      } else {
        alert("Failed to delete Task, please ensure you are have a working network connection.")
      }
    })

    
  }

  
  function toggleTaskComplete(id) {

    const selectedTask = tasks.filter(task => task._id === id)

    apis.toggleTaskCompletion(id, {is_completed:!selectedTask[0].is_completed }).then(response => {
      console.log(response)
      const data = response.data
      if (data.success) {
        console.log("toggle success")
        setTasks((prevTasks) =>
        prevTasks.map((task, i) => {
          if (task._id === id) {
            return { ...task, is_completed: !task.is_completed };
          }
          return task;
        })
      );
      }
      else {
        alert("Failed to Toggle Task completion, please ensure you are have a working network connection.")
      }
    })

      


  }


  return (
    <>
      <div>

       <Header navigation={navigation} setNavigation={setNavigation} 
        setIsSearch={setIsSearch}
         setFilterOption={setFilterOption} /> 

        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {navigation.find((item) => item.current)?.name} Tasks</h1>
              <button type="button" className="text-sm px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600" onClick={() => SetIsCreateTaskOpen(true)}> Add Task </button> 
            </div>
          </header>
          <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <CreateTaskDialog open={isCreateTaskOpen} setOpen={SetIsCreateTaskOpen} onAdd={addTask} />

              <SearchPalette open={isSearch} setOpen={setIsSearch} tasks={tasks} />

              <div className='flex flex-row'>
{/* Priority filter dropdown */}
              <div className="m-2 ">
                <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700">
                  Filter by Priority:
                </label>
                <select
                  id="priorityFilter"
                  name="priorityFilter"
                  className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* due Date range filter */}
              <div className="m-2 ">
                <label htmlFor="specificDate" className="block text-sm font-medium text-gray-700">Filter by Specific Date:</label>
                  <input
                    type="date"
                    id="specificDate"
                    name="specificDate"
                    className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={specificDate}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSpecificDate(e.target.value)
                      } else {
                        setSpecificDate("")
                      }
                      
                    }}
                  />
              </div>
              </div>

               

          <div className='flex flex-wrap'>
          {filteredTasks.map((task, index) => {
                return (
                  <TaskCard
                    key = {index}
                    id={task._id}
                    title = {task.title}
                    content = {task.description}
                    dueDate={ task.due_date}
                    priority={task.priority}
                    isCompleted={task.is_completed}
                    toggleTaskComplete = {() => toggleTaskComplete(task._id)}
                    onEdit={editTask}
                    onDelete={deleteTask}
                   />
                )
              })}
          </div>

             
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
