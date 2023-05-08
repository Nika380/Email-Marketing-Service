import { Button, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BulkMailModal from '../modals/BulkMailModal';
import DeleteIcon from '@mui/icons-material/Delete';
import { API } from '../utils/API';


const GroupsComponent = ({groupName, emailNumber, id, openBulkModal, refreshFunction, startGroupDelete, deletedSuccessfully}: any) => {
    const navigate = useNavigate();
    const [refreshPage, setRefreshPage] = useState<boolean>(false);
    
    const handleSendBulkMailClick = () => {
      openBulkModal({nameOfGroup: groupName});
    }

    const deleteGroup = async () => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      setRefreshPage(false)
      startGroupDelete();
      try {
        const response = await API.delete(`/groups/delete-group/${id}`, {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        });
        console.log(response);
        deletedSuccessfully()
        setTimeout(() => {
          setRefreshPage(true)
        }, 3000)
      } catch(error) {
        console.log(error);
      }
    };

    useEffect(() => {
      if(refreshPage) {
        refreshFunction();
      }
    }, [refreshPage])

  return (
    <>
      <div className='groups-component' onDoubleClick={() => navigate(`/groups/${id}/${groupName}`)}>
        <Tooltip title="Delete Group">
            <Button variant="outlined" color="error" sx={{position:"absolute", top:'15px', right:'30px'}} onClick={deleteGroup}>
              <DeleteIcon />
            </Button>
          </Tooltip>
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