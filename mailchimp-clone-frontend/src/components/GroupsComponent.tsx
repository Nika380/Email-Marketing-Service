import React from 'react'
import { useNavigate } from 'react-router-dom'

const GroupsComponent = ({groupName}: any) => {
    const navigate = useNavigate();
  return (
    <div className='groups-component' onDoubleClick={() => navigate(`/groups/${groupName}`)}>
        <ul>
            <li>Group Name: </li>
            <li>Some Name</li>
        </ul>

        <ul>
            <li>Email Address Count: </li>
            <li>10</li>
        </ul>
    </div>
  )
}

export default GroupsComponent