import React from 'react'
import { useNavigate } from 'react-router-dom'

const GroupsComponent = ({groupName, emailNumber, id}: any) => {
    const navigate = useNavigate();
  return (
    <div className='groups-component' onDoubleClick={() => navigate(`/groups/${id}/${groupName}`)}>
        <ul>
            <li>Group Name: </li>
            <li>{groupName}</li>
        </ul>

        <ul>
            <li>Email Address Count: </li>
            <li>{emailNumber}</li>
        </ul>
    </div>
  )
}

export default GroupsComponent