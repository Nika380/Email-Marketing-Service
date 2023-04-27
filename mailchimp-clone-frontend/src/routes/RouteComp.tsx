import React, { useContext , useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard';
import AuthContext from '../context/AuthProvider'
import RegisterPage from '../pages/RegisterPage';
import PasswordReset from '../pages/PasswordReset';
import Groups from '../pages/Groups';
import EmailLists from '../pages/EmailLists';
import GroupInfoPage from '../pages/GroupInfoPage';
import EmailListInfoPage from '../pages/EmailListInfoPage';

const RouteComp = () => {
    const { auth, setAuth }: any = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
        const checkAuth = JSON.parse(localStorage.getItem("jwtToken") || "null");
        const now = new Date();
        if((location.pathname !== '/login') && (location.pathname !== '/reset-password') && location.pathname !== "/register") {
          if(checkAuth?.jwtToken !== "" && checkAuth?.expireTime > now) {
            setAuth(true)
        } else {
            setAuth(false)
            localStorage.removeItem('jwtToken');
            navigate('/')
        }
        }
      }, [auth, setAuth])
    

  return (
    <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/reset-password' element={<PasswordReset />} />
          <Route path='/groups' element={<Groups />}/>
          <Route path='/groups/:id/:name' element={<GroupInfoPage />}/>
          <Route path='/email-lists' element={<EmailLists />} />
          <Route path='/email-lists/:name' element={<EmailListInfoPage />} />
    </Routes>
  )
}

export default RouteComp

