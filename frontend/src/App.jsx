import { useState } from 'react'

import './styles/App.css'
import Navbar from './components/Navbar'
import AddTask from './components/AddTask'
import { Route, Routes } from 'react-router-dom'
import List from './components/List'
import UpdateTask from './components/UpdateTask'
import Signup from './components/Signup'
import Login from './components/Login'
import Protected from './components/Protected'


function App() {
  

  return (
    <>
    <Navbar />
    <Routes>
     <Route path='/' element={<Protected><List/></Protected>} />
     <Route path='/add' element={<Protected><AddTask/></Protected>}/>
      <Route path='/update-task/:id' element={<Protected><UpdateTask /></Protected>}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path="/login" element={<Login />}/>
    </Routes>
    </>
  )
}

export default App
