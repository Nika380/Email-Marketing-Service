import React, { useContext , useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard';
import AuthContext from '../context/AuthProvider'
import RegisterPage from '../pages/RegisterPage';

const RouteComp = () => {
    const { auth, setAuth }: any = useContext(AuthContext);
    const navigate = useNavigate();
    
  
    useEffect(() => {
        const checkAuth = JSON.parse(localStorage.getItem("jwtToken") || "null");
        const now = new Date();
        if(checkAuth?.jwtToken !== "" && checkAuth?.expireTime > now) {
            setAuth(true)
        } else {
            setAuth(false)
            localStorage.removeItem('jwtToken');
            navigate('/')
        }
      }, [auth, setAuth])
    

  return (
    <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
  )
}

export default RouteComp
