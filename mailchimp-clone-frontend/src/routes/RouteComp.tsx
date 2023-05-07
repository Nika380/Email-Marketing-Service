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
import { API } from '../utils/API';
import ChangeGroupNameContext, { ChangeGroupNameContextProvider } from '../context/NameChangeContext';
import { ChangeListNameContextProvider } from '../context/ListNameChangeContext';

const RouteComp = () => {
    const { auth, setAuth }: any = useContext(AuthContext);
    const {groupName, setGroupName}: any = useContext(ChangeGroupNameContext);
    const navigate = useNavigate();
    const location = useLocation();

    const jwtToken = () => {
      const checkAuth = JSON.parse(localStorage.getItem("jwtToken") || "null");
        const now = new Date();
        if((location.pathname !== '/login') && (location.pathname !== '/reset-password') && location.pathname !== "/register") {
          if(checkAuth?.jwtToken !== "" && checkAuth?.expireTime > now) {
            setAuth(true);
            if(location.pathname === '/') {
              navigate("/dashboard");
            }
        } else {
            setAuth(false)
            localStorage.removeItem('jwtToken');
            navigate('/')
        }
        }
    }

    const refreshToken = async () => {
      const checkRefreshToken = JSON.parse(localStorage.getItem("refreshToken") || "null");
      if(checkRefreshToken === "null") {
        return null;
      }
      const checkJwtToken = JSON.parse(localStorage.getItem("jwtToken") || "null");
      if(checkJwtToken === null || checkJwtToken.expireTime < new Date()) {
        await refresh({ token: checkRefreshToken.refreshToken });
        refreshToken();
        return null;
      }
      let now = new Date();
      const tokenExpireTime = checkJwtToken?.expireTime;
      let timeDiff = new Date(tokenExpireTime - 10000);

      const intervalId = setInterval(async () => {
        now = new Date(now.getTime() + 1000);

        if (new Date() > timeDiff) {
          clearInterval(intervalId);
          console.log("token refreshed");
          await refresh({ token: checkRefreshToken.refreshToken });
          
          refreshToken();
        }
      }, 1000);
};

    

const refresh = async ({token}: any) => {
  const response = await API.post("/auth/refresh", {
    refreshToken: token
  });
  if(response.status === 201) {
    const now = new Date();
    const expireTime = now.getTime() + 10 * 60 * 1000;
    const tokenData = {
        token: response.data.jwtToken,
        expireTime: expireTime
      };
      localStorage.setItem('jwtToken', JSON.stringify(tokenData));
      if(location.pathname === "/") {
        navigate('/dashboard')
      }
    } else {
      console.log("Jwt Not Refreshed");
    }
  return response;
};


    useEffect(() => {
      refreshToken();
    }, [])
  
    useEffect(() => {
        jwtToken();
      }, [auth, setAuth])
    

  return (
    <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/reset-password' element={<PasswordReset />} />
          <Route path='/groups' element={<Groups />}/>
          <Route path='/groups/:id/:name' element={<ChangeGroupNameContextProvider><GroupInfoPage /></ChangeGroupNameContextProvider>} />
          <Route path='/email-lists' element={<EmailLists />} />
          <Route path='/email-lists/:id/:name' element={<ChangeListNameContextProvider><EmailListInfoPage /></ChangeListNameContextProvider>} />
    </Routes>
  )
}

export default RouteComp

