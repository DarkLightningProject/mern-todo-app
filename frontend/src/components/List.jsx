import { useState, useEffect, Fragment } from 'react'
import '../styles/list.css'
import { Link } from 'react-router-dom'
const List = () => {
  const [tasksData, setTasksData] = useState([])
  const [error, setError] = useState('')

  const [selectedTasks, setSelectedTasks] = useState([])

  const selectAll=(e)=>{
    const { checked } = e.target;
    if (checked){
      let items = tasksData.map((task) => task._id);
      setSelectedTasks(items);
    } else {
      setSelectedTasks([]);
    }
  }

  const deleteMultiple = async ()=>{
    try {
    const response = await fetch(`http://localhost:3200/delete-multiple/`, {
      method: 'DELETE',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: selectedTasks })
    });
    const result = await response.json();
    if (result.success) {
      setTasksData((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task._id)));
    }else{
      alert("Try after sometime")
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

   
 const selectSingleTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId)); 
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  useEffect(() => {
    const getListData = async () => {
      try {
        const response = await fetch('http://localhost:3200/tasks', {
          credentials: 'include'
        })
        const list = await response.json()

        if (list.success) {
          setTasksData(list.tasks || [])
          setError('')
        } else {
          setError(list.msg || list.message || 'Unable to load tasks')
        }
      } catch (error) {
        setError('Unable to connect to the task server')
        console.error('Error fetching tasks:', error)
      }
    }
  
    getListData()
  }, [])
const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`http://localhost:3200/delete-task/${taskId}`, {
      method: 'DELETE',
      credentials:'include',
    });
    const result = await response.json();
    if (result.success) {
      setTasksData((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    }else{
      alert("Try after sometime")
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

  return (
    <div className='list-container'>
      <h1 className='list-title'>To Do List</h1>
      {error && <p className='list-error'>{error}</p>}
      <button onClick={deleteMultiple} className='btn btn-danger' >Delete</button>
      <table className='task-table'>
        <thead>
          <tr>
            <th> <input onChange={selectAll} type="checkbox" /></th>
            <th>S.No</th>
            <th>Title</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasksData.map((task, index) => (
            <Fragment key={task._id || task.id || index}>
            <tr key={task._id || task.id || index}>
              <td><input onChange={()=>selectSingleTask(task._id)} checked={selectedTasks.includes(task._id)}  type="checkbox" /></td>
              <td>{index + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                
                <button onClick= {()=>deleteTask(task._id)} className='btn btn-danger'>Delete</button>
                <Link to={`/update-task/${task._id}`} className="update-item">Update</Link>
              </td>
            </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>

  )
}


export default List
