import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { API } from '../utils/API';



const BulkMailModal = ({ closeModal, groupToSendMail }: { closeModal: any, groupToSendMail: string }) => {

  const [groupName, setGroupName] = useState<string>(groupToSendMail !== "" ? groupToSendMail : "");
  const [sender, setSender] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  const sendBulkMails = async () => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    try {
      const response = await API.post(
        `/send-mail/send-bulk/${groupName}`,
        {
          mailSubject: subject,
          mailSender: sender,
          mailBody: body
        },
        {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        }
      );
      console.log(response)
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className='bulk-modal close' onClick={(e) => closeModal(e)}>
        <div className="modal">
          <Stack spacing={3}>
              <TextField type='text' label="Sender Name" placeholder='Name User is going to get the mail from' onChange={(e) => setSender(e.target.value)}/>
              <TextField type='text' label="Subject" placeholder='Subject of the mail' onChange={(e) => setSubject(e.target.value)}/>
              <TextField type='text' label="Body" placeholder='Content of the email' multiline rows={17} onChange={(e) => setBody(e.target.value)}/>

              <Stack direction="row" justifyContent="space-between" height="35px" className='bottom-section'>
                <Stack>
                  <TextField label="Group Name" helperText="*Type Group Name To Send Email To" value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                </Stack>

                <Stack direction="row" spacing={3} justifyContent="end">
                  <Button sx={{textTransform:"none"}} color='error' variant='outlined' className='close' onClick={(e) => closeModal(e)}>Cancel</Button>
                  <Button sx={{textTransform:"none"}} variant='contained' onClick={sendBulkMails}>Send</Button>
                </Stack>
              </Stack>
          </Stack>
        </div>
    </div>
  )
}

export default BulkMailModal