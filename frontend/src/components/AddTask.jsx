
import '../styles/addtask.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddTask = () => {
  const [taskData, setTaskData] = useState({ title: '', description: '' });
  const navigate = useNavigate();
  const handleAddTask = async (event) => {
    event.preventDefault();
    console.log(taskData);
    const response = await fetch('http://localhost:3200/add-task', {
      method: 'POST',
      body: JSON.stringify(taskData), 
      credentials:"include",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();

    console.log(result);
    if (result.success) {
      navigate('/');
      console.log("task added successfully");
    }else{
      alert("try after sometime")
    }
  }

  return (
    <div className='container'>

        <h1>Add Task</h1>
      <form>
        <label htmlFor="task">Title:</label>
        <input onChange={(event)=>setTaskData({...taskData, title: event.target.value})} type="text" id="task" name="title" placeholder="Enter task title" />
        <label htmlFor="description">Description:</label>
        <textarea onChange={(event)=>setTaskData({...taskData, description: event.target.value})} id="description" name="description" placeholder="Enter task description"></textarea>
        <button onClick={handleAddTask} className='submit-btn' type="submit">Add Task</button>


      </form>
    </div>
  )
}

export default AddTask
