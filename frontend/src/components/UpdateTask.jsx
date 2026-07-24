
import '../styles/addtask.css'
import { useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const UpdateTask = () => {
  const [taskData, setTaskData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTask(id);
  },[id])

  const getTask = async (id) => {
    try {
      let res = await fetch(`http://localhost:3200/task/${id}`, {
        credentials: 'include'
      });
      let task = await res.json();

      if (task.result) {
        setTaskData({
          title: task.result.title || '',
          description: task.result.description || ''
        });
        setError('');
      } else {
        setError(task.msg || task.message || 'Unable to load task details');
      }
    } catch (fetchError) {
      setError('Unable to connect to the task server');
    }
  }

  const handleUpdateTask = async (event) => {
    event.preventDefault();

    let res = await fetch(`http://localhost:3200/update-task/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    let result = await res.json();
    if (result.success) {
      navigate('/');
    } else {
      setError(result.msg || result.message || 'Unable to update task');
    }
  }
 
  return (
    <div className='container'>

        <h1>Update Task</h1>
      {error && <p className='list-error'>{error}</p>}
      <form>
        <label htmlFor="task">Title:</label>
        <input
          onChange={(event)=>setTaskData({...taskData, title: event.target.value})}
          type="text"
          id="task"
          name="title"
          placeholder="Enter task title"
          value={taskData.title}
        />
        <label htmlFor="description">Description:</label>
        <textarea
          onChange={(event)=>setTaskData({...taskData, description: event.target.value})}
          id="description"
          name="description"
          placeholder="Enter task description"
          value={taskData.description}
        ></textarea>
        <button onClick={handleUpdateTask} className='submit-btn' type="submit">Update Task</button>


      </form>
    </div>
  )
}

export default UpdateTask
