import { Button, Stack, TextField } from '@mui/material'

const BulkMailModal = ({closeModal}: any) => {
  return (
    <div className='bulk-modal close' onClick={(e) => closeModal(e)}>
        <div className="modal">
          <Stack spacing={3}>
              <TextField type='text' label="Sender Name" placeholder='Name User is going to get the mail from'/>
              <TextField type='text' label="Subject" placeholder='Subject of the mail'/>
              <TextField type='text' label="Body" placeholder='Content of the email' multiline rows={17}/>

              <Stack direction="row" spacing={3} justifyContent="end">
                <Button sx={{textTransform:"none"}} color='error' variant='outlined' className='close' onClick={(e) => closeModal(e)}>Cancel</Button>
                <Button sx={{textTransform:"none"}} variant='contained'>Send</Button>
              </Stack>
          </Stack>
        </div>
    </div>
  )
}

export default BulkMailModal