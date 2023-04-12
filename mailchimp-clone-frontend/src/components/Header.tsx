import React from 'react'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate();
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
            <button className="register">
                Register
            </button>
            <button className="login" onClick={() => navigate('/login')}>
                Sign In
            </button>
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