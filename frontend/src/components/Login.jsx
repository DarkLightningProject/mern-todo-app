
import { Link } from 'react-router-dom';
import '../styles/addtask.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AUTH_STORAGE_KEY = 'login';


const Login = () => {
 
  const [userData, setUserData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  useEffect(()=>{
    if(localStorage.getItem(AUTH_STORAGE_KEY)){
      navigate('/')
    }
  }, [navigate])
    const handleLogin = async (e) => {
    e.preventDefault();
    console.log(userData);
    const response = await fetch('http://localhost:3200/login', {
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
      window.dispatchEvent(new Event('localStorage-change'))
      navigate('/');
    }
  };
  return (
    <div className='container'>

        <h1>Login</h1>
      <form>
       
        <label htmlFor="email">Email:</label>
        <input onChange={(e) => setUserData({...userData, email: e.target.value})} type="email" id="email" name="email" placeholder="Enter email" />
        <label htmlFor="password">Password:</label>
        <input onChange={(e) => setUserData({...userData, password: e.target.value})} type="password" id="password" name="password" placeholder="Enter password" />
        <button onClick={handleLogin} className='submit-btn' type="submit">Login</button>
        <Link className='form-link' to="/signup">Don't have an account? Signup</Link>


      </form>
    </div>
  )
}

export default Login
