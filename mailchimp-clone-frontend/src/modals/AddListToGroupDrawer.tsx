import { Alert, Autocomplete, Box, Button, CircularProgress, Drawer, Snackbar, Stack, TextField, Slide } from "@mui/material"
import { useEffect, useState } from "react";
import { API } from "../utils/API";


interface mailList {
    id: number,
    listName: string
}


const AddListToGroupDrawer = ({groupId}: any) => {
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const [mailList, setMailList] = useState<mailList[]>([]);
    const [listName, setListName] = useState<mailList | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertText, setAlertText] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    
    const addListToGroup = async () => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        setLoading(true);
        try {
          const response = await API.put(
            `/groups/add-list-to-group/${groupId}/${listName?.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${tok?.token}`
              }
            }
          );
          if(response.status === 201) {
            setLoading(false);
            setAlertText("List Added Successfully!");
            setIsSuccess(true);
            setShowAlert(true);
          }
        } catch(error: any) {
            setLoading(false);
            if(error.response.status === 409) {
                setAlertText("List is already in group!");
            } else {
                setAlertText("Something Went Wrong!")
            }
            setIsSuccess(false);
            setShowAlert(true);
          console.log(error);
        }
    }

    const handleAlertClose = () => {
        setShowAlert(false)
    }

    const getListsInfo = async () => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        try {
          const response = await API.get(
            `/groups/list`,
            {
              headers: {
                Authorization: `Bearer ${tok?.token}`
              }
            }
          );
          const lists = response.data.map((list: any) => {
            return {
              id: list.id,
              listName: list.listName            }
          });
          setMailList(lists)
        } catch(error) {
          console.log(error);
        }
      }

      useEffect(() => {
        getListsInfo()
      }, [openDrawer, setOpenDrawer])
  return (
    <>
    <Button
        sx={{position:"absolute", right: "50px", textTransform:"none"}}
        variant="outlined"
        color="info"
        onClick={() => setOpenDrawer(true)}
        >
            Add List To Group
    </Button>

        <Drawer
            anchor="right"
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
        >
            <Box width="400px" padding="50px">
                <Stack direction="column" spacing={4}>
                <Autocomplete
                    options={mailList}
                    id="add list"
                    value={listName}
                    onChange={(event, newValue) => setListName(newValue)}
                    getOptionLabel={(list) => list.listName} // Specify the property to use as the label
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Find List"
                        />
                    )}
                    />

                    <Stack direction="row" spacing={3} justifyContent="end">
                        <Button sx={{textTransform:"none"}} color="error" onClick={() => setOpenDrawer(false)}>Cancel</Button>
                        <Button sx={{textTransform:"none"}} variant="outlined" onClick={addListToGroup}>Add List</Button>
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
                autoHideDuration={6000}
                onClose={handleAlertClose}
                TransitionComponent={Slide}
            >
                <Alert onClose={handleAlertClose} severity={isSuccess ? "success" : "error"}> {alertText} </Alert>
            </Snackbar>
        </Drawer>
    </>
  )
}

export default AddListToGroupDrawer