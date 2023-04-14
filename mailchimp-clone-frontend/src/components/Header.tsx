import React from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';

const Header = () => {
    const navigate = useNavigate();
    const {auth, setAuth} = useContext(AuthContext);
    const logOut = () => {
        localStorage.removeItem('jwtToken')
        setAuth(false);
        navigate('/')
      }


  return (
    <div className='header'>
        <div className="logo">
        
        </div>

        <div className="info-list">
            <ul>
                <li>Services</li>
                <li>Pricing</li>
            </ul>
        </div>

        <div className="login-section">
            {
                auth ? <button className='logout' onClick={logOut}>Log Out</button>
                : <><button onClick={() => navigate('/register')} className="register">
                          Register
                      </button><button className="login" onClick={() => navigate('/login')}>
                              Sign In
                          </button></>
            }
        </div>

        <button className="select-language">
            <select name="" id="">
                <option value="en">EN</option>
                <option value="ka">KA</option>
            </select>
        </button>
    </div>
  )
}

export default Header