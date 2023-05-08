import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { API } from '../utils/API';

const ChangeGroupNameModal = ({onModalClose, groupName, setGroupName, setShowGroupChangeModal, id}: any) => {

    const [newGroupName, setNewGroupName] = useState<string>(groupName);
    const [errorText, setErrorText] = useState<string>("");
    const [showErrorText, setShowErrorText] = useState<boolean>(true);

    const saveNewGroupName = async (newName: string) => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      try {
          const response = await API.put(`/groups/change-name/${id}`, 
          {
              newGroupName: newName
          },
          {
              headers: {
                  Authorization: `Bearer ${tok?.token}`
              }
          }
          );
            setGroupName(newName);
            setShowGroupChangeModal(false);
          
      } catch (error) {
          setErrorText("Group With This Name Already Exists");
          setShowErrorText(true);
          setTimeout(() => {
            setShowErrorText(false);
          }, 3000)
          console.log(error)
      }
  }

  return (
    <div className='group-name-modal close' onClick={(e) => onModalClose(e)}>
        <div className="modal">
            <TextField sx={{width:"100%"}}
                label="Change Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                helperText={showErrorText ? errorText : null}
               />
            <Stack direction="row-reverse" justifyContent="center" paddingTop="120px" spacing={5}>
                <Button sx={{textTransform:"none"}} variant='contained' onClick={() => saveNewGroupName(newGroupName)}>Save</Button>
                <Button sx={{textTransform:"none"}} variant='outlined' color='error' className='close' onClick={(e) => onModalClose(e)}>Cancel</Button>
            </Stack>
        </div>
    </div>
  )
}

export default ChangeGroupNameModal