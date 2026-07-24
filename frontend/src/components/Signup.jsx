
import { Link } from 'react-router-dom';
import '../styles/addtask.css'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'login';

const Signup = () => {
  const navigate = useNavigate();
    useEffect(()=>{
      if(localStorage.getItem(AUTH_STORAGE_KEY)){
        navigate('/')
      }
    }, [navigate])
  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(userData);
    const response = await fetch('http://localhost:3200/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const result = await response.json();

    console.log(result);
    if (result.success) {
      console.log('task added successfully');
      localStorage.setItem(AUTH_STORAGE_KEY, userData.email)
    
      navigate('/');
    }
  };

  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  return (
    <div className='container'>

        <h1>Signup</h1>
      <form>
        <label htmlFor="username">Username:</label>
        <input onChange={(e) => setUserData({...userData, username: e.target.value})} type="text" id="username" name="username" placeholder="Enter username" />
        <label htmlFor="email">Email:</label>
        <input onChange={(e) => setUserData({...userData, email: e.target.value})} type="email" id="email" name="email" placeholder="Enter email" />
        <label htmlFor="password">Password:</label>
        <input onChange={(e) => setUserData({...userData, password: e.target.value})} type="password" id="password" name="password" placeholder="Enter password" />
        <button onClick={handleSignup} className='submit-btn' type="submit">Signup</button>
        <Link className='form-link' to="/login">Already have an account? Login</Link>


      </form>
    </div>
  )
}

export default Signup
