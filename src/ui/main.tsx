import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './Routes/login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
      </Routes>
    </HashRouter>
  </StrictMode>
)
