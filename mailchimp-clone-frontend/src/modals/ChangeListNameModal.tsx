import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { API } from '../utils/API';

const ChangeListNameModal = ({onModalClose, listName, setListName, setShowListNameChangeModal, id}: any) => {

    const [newListName, setNewListName] = useState<string>(listName);
    const [errorText, setErrorText] = useState<string>("");
    const [showErrorText, setShowErrorText] = useState<boolean>(true);

    const saveNewListName = async (newName: string) => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      try {
          const response = await API.put(`/groups/change-list-name/${id}`, 
          {
              newListName: newName
          },
          {
              headers: {
                  Authorization: `Bearer ${tok?.token}`
              }
          }
          );
            setListName(newName);
            setShowListNameChangeModal(false);
            console.log(response)
          
      } catch (error) {
          setErrorText("List With This Name Already Exists");
          setShowErrorText(true);
          setTimeout(() => {
            setShowErrorText(false);
          }, 3000)
          console.log(error)
      }
  }

  return (
    <div className='list-name-modal close' onClick={(e) => onModalClose(e)}>
        <div className="modal">
            <TextField sx={{width:"100%"}}
                label="Change List Name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                helperText={showErrorText ? errorText : null}
               />
            <Stack direction="row-reverse" justifyContent="center" paddingTop="120px" spacing={5}>
                <Button sx={{textTransform:"none"}} variant='contained' onClick={() => saveNewListName(newListName)}>Save</Button>
                <Button sx={{textTransform:"none"}} variant='outlined' color='error' className='close' onClick={(e) => onModalClose(e)}>Cancel</Button>
            </Stack>
        </div>
    </div>
  )
}

export default ChangeListNameModal