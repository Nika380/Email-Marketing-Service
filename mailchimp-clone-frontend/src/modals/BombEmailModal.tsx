import { Button, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import { API } from '../utils/API';
import CircularProgress from '@mui/material/CircularProgress';

const BombEmailModal = ({closeBombModal}: any) => {
    const [number, setNumber] = useState<number>();
    const [sender, setSender] = useState<string>("");
    const [recipient, setRecipient] = useState<string>("");
    const [emailBody, setEmailBody] = useState<string>("");
    const [loadingText, setLoadingText] = useState<string>("Email Bombing Is Started Successfully");
    const [startLoading, setStartLoading] = useState<boolean>(false);
    const sendBombMail = async () => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      setStartLoading(true);
      try {
        const response = await API.post(
          `/send-mail/bomb-email/${number}`,
          {
            emailTo: recipient,
            emailBody: emailBody,
            emailSender: sender
          },
          {
            headers: {
              Authorization: `Bearer ${tok?.token}`
            }
          }
        );
        console.log(response.status);
        if(response.status === 201) {
          setLoadingText("Email Bombed Successfully")
        } else {
          setLoadingText("There was an error, Email Bombing Is Stopped");
        }
        setTimeout(() => {
          setStartLoading(false);
        }, 3000)
      } catch (error) {
        console.error(error);
      }
    };
    

  return (
    <div className='bomb-mail-modal close' onClick={(e) => closeBombModal(e)}>
        <div className="modal">
          <Stack spacing={3}>
              <Stack direction="row" spacing={2}>
                  <TextField sx={{width:"80%"}} type='text' label="Sender Name" placeholder='Name User is going to get the mail from' onChange={(e) => setSender(e.target.value)}/>
                  <TextField type='number' label="number of messages" onChange={(e) => setNumber(parseInt(e.target.value))}/>
              </Stack>
              <TextField type='text' label="Recipient Email Address" placeholder='Write email address you want to bomb with messages' onChange={(e) => setRecipient(e.target.value)}/>
              <TextField type='text' label="Body" placeholder='Content of the email' multiline rows={17} onChange={(e) => setEmailBody(e.target.value)}/>

              <Stack direction="row" spacing={3} justifyContent="end">
                <Button sx={{textTransform:"none"}} color='error' variant='outlined' className='close' onClick={(e) => closeBombModal(e)}>Cancel</Button>
                <Button sx={{textTransform:"none"}} variant='contained' onClick={sendBombMail}>Start Bombing</Button>
              </Stack>
          </Stack>

          {startLoading && 
          <div className="loading">
          <CircularProgress />
          <h1>{loadingText}</h1>
        </div>}
        </div>
    </div>
  )
}

export default BombEmailModal