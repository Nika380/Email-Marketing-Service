import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

const ChangeGroupNameModal = ({onModalClose, groupName, saveNewName}: any) => {

    const [newGroupName, setNewGroupName] = useState<string>(groupName)

  return (
    <div className='group-name-modal close' onClick={(e) => onModalClose(e)}>
        <div className="modal">
            <TextField sx={{width:"100%"}} label="Change Group Name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}/>
            <Stack direction="row-reverse" justifyContent="center" paddingTop="120px" spacing={5}>
                <Button sx={{textTransform:"none"}} variant='contained' onClick={() => saveNewName(newGroupName)}>Save</Button>
                <Button sx={{textTransform:"none"}} variant='outlined' color='error' className='close' onClick={(e) => onModalClose(e)}>Cancel</Button>
            </Stack>
        </div>
    </div>
  )
}

export default ChangeGroupNameModal