import { Autocomplete, Box, Button, Drawer, Stack, TextField, CircularProgress, Alert, Snackbar, Slide } from '@mui/material'
import { useEffect, useState } from 'react'
import { API } from '../utils/API';


const AddEmailToListDrawer = ({listId}: any) => {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [emailAddress, setEmailAddress] = useState<string>("");

    const handleAlertClose = () => {
        setShowAlert(false);
    }

    const saveNewEmailInGroup = async () => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        setLoading(true)
        try {
            const response = await API.put(`/groups/add-email-to-list/${listId}/${emailAddress}`, 
            {},
            {
                headers: {
                    Authorization: `Bearer ${tok?.token}`
                }
            }
            );
            if(response.status === 201) {
                setLoading(false);
                setAlertText("Email Added Successfully!");
                setIsSuccess(true);
                setShowAlert(true);
            }
            
        } catch (error: any ) {
            setLoading(false);
            if(error.response.status === 409) {
                setAlertText("Email Already Exists in List!")
            } else {
                setAlertText("Something Went Wrong");
            }
            setIsSuccess(false);
            setShowAlert(true);
            console.log(error)
        }
    }
   

  return (
    <>
        <Button 
            sx={{position:"absolute", textTransform:"none", marginRight:"100px", marginBottom:"30px"}}
            variant="outlined"
            onClick={() => setOpenDrawer(true)}
        >
            Add Email Addresses To List
        </Button>
        <Drawer
         anchor='right'
         open={openDrawer}
         onClose={() => setOpenDrawer(false)}
         >
            <Box width="400px" padding="50px">
                <Stack direction="column" spacing={3}>
                    <TextField 
                        label="Type Email Address"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <Stack direction="row" spacing={2} justifyContent="end">
                        <Button sx={{textTransform:"none"}} color="error" onClick={() => setOpenDrawer(false)}>Cancel</Button>
                        <Button sx={{textTransform:"none"}} variant="outlined" onClick={saveNewEmailInGroup}>Add Email</Button>
                    </Stack>
                </Stack>
            </Box>

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
        </Drawer>
    </>
  )
}

export default AddEmailToListDrawer