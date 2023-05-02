import { Button } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BulkMailModal from '../modals/BulkMailModal';

const GroupsComponent = ({groupName, emailNumber, id, openBulkModal}: any) => {
    const navigate = useNavigate();
    
    const handleSendBulkMailClick = () => {
      openBulkModal({nameOfGroup: groupName});
  }
  return (
    <>
      <div className='groups-component' onDoubleClick={() => navigate(`/groups/${id}/${groupName}`)}>
          <ul>
              <li>Group Name: </li>
              <li>{groupName}</li>
          </ul>

          <ul>
              <li>Email Address Count: </li>
              <li>{emailNumber}</li>
          </ul>
          <Button sx={{textTransform:"none", marginTop:"50px"}} variant='contained' onClick={handleSendBulkMailClick}>Send Bulk Mail</Button>
      </div>
    </>
  )
}

export default GroupsComponent