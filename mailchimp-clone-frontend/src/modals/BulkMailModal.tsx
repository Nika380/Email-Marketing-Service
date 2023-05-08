import { Alert, Autocomplete, Button, CircularProgress, Slide, Snackbar, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { API } from '../utils/API';


interface group {
  id: number,
  groupName: string
}


const BulkMailModal = ({ closeModal, groupToSendMail }: { closeModal: any, groupToSendMail: string }) => {

  const [groupName, setGroupName] = useState<group | null>({id: 0, groupName:groupToSendMail});
  const [sender, setSender] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [groupList, setGroupList] = useState<group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);


  const handleAlertClose = () => {
    setShowAlert(false);
  }

  const sendBulkMails = async () => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    setLoading(true);
    try {
      const response = await API.post(
        `/send-mail/send-bulk/${groupName?.groupName}`,
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
      if(response.status === 201) {
        setLoading(false);
        setAlertText("Emails Sent Successfully!");
        setIsSuccess(true);
        setShowAlert(true);
      }
  } catch (error) {
    setLoading(false);
    setAlertText("Something Went Wrong");
    setIsSuccess(false);
    setShowAlert(true);
    console.log(error)
  }
}

  const getGroups = async () => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    try {
      const response = await API.get(
        `/groups/groups-list`,
        {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        }
      );
      setGroupList(response.data);
  } catch(error) {
    console.log(error);
  }
  }

  useEffect(() => {
    getGroups();
  }, [])

  return (
    <>
    <div className='bulk-modal close' onClick={(e) => closeModal(e)}>
        <div className="modal">
          <Stack spacing={3}>
              <TextField type='text' label="Sender Name" placeholder='Name User is going to get the mail from' onChange={(e) => setSender(e.target.value)}/>
              <TextField type='text' label="Subject" placeholder='Subject of the mail' onChange={(e) => setSubject(e.target.value)}/>
              <TextField type='text' label="Body" placeholder='Content of the email' multiline rows={17} onChange={(e) => setBody(e.target.value)}/>

              <Stack direction="row" justifyContent="space-between" height="35px" className='bottom-section'>
                <Stack width="300px">
                  {/* <TextField label="Group Name" helperText="*Type Group Name To Send Email To" value={groupName} onChange={(e) => setGroupName(e.target.value)}/> */}
                  <Autocomplete
                    options={groupList}
                    value={groupName}
                    renderInput={(params) => (
                      <TextField
                      {...params}
                      label="Find Group"
                      />
                  )}
                  getOptionLabel={(group) => group.groupName}
                  onChange={(event, newValue) => setGroupName(newValue)}

                  />
                </Stack>

                <Stack direction="row" spacing={3} justifyContent="end">
                  <Button sx={{textTransform:"none"}} color='error' variant='outlined' className='close' onClick={(e) => closeModal(e)}>Cancel</Button>
                  <Button sx={{textTransform:"none"}} variant='contained' onClick={sendBulkMails}>Send</Button>
                </Stack>
              </Stack>
          </Stack>
        </div>
    </div>

    {loading &&
              <div className="loading">
                <CircularProgress color='secondary' />
              </div>
            }

            <Snackbar
                open={showAlert}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                TransitionComponent={Slide}
            >
                <Alert onClose={handleAlertClose} severity={isSuccess ? "success" : "error"}> {alertText} </Alert>
            </Snackbar>
    </>
  )
}

export default BulkMailModal