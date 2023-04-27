import React from 'react'
import { useNavigate } from 'react-router-dom'

const EmailListComponent = ({listName}: any) => {
    const navigate = useNavigate();
  return (
    <div className='email-list-component' onDoubleClick={() => navigate(`/email-lists/${listName}`)}>
        <ul>
            <li>List Name: </li>
            <li>Some Name</li>
        </ul>

        <ul>
            <li>Email Address Count: </li>
            <li>10</li>
        </ul>
    </div>
  )
}

export default EmailListComponent