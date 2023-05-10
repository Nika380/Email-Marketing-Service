import { Autocomplete, Button, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { API } from '../utils/API';
import { array } from 'yup';

interface list {
  id: number,
  listName: string
}


const CreateNewGroupModal = ({closeModal, pageRefresh, closeWithFunction} : any) => {

  const [listArray, setListArray] = useState<list[]>([]);
  const [listEntity, setListEntity] = useState<list | null>({id: 0, listName: ""});
  const [groupName, setGroupName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showListErrorText, setShowListErrorText] = useState<boolean>(false);
  const [showGroupErrorText, setShowGroupErrorText] = useState<boolean>(false);
  const [groupErrorText, setGroupErrorText] = useState<string>("");
  const [listErrorText, setListErrorText] = useState<string>("");
  const [listOptions, setListOptions] = useState<list[]>([]);

  const addListNameToArray = async () => {
    const listExists = listArray.some((list) => list.listName === listEntity?.listName);
    
    if(listExists) {
      setListErrorText("List Is already in group");
      setShowListErrorText(true);
      setTimeout(() => {
        setShowListErrorText(false)
      }, 5000)
    } else {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      try {
        const response = await API.get(`/groups/find-list/${listEntity?.listName}`, {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        })
        console.log(response.data.id)
        if(response.status === 202) {
          const updatedListEntity = {
            id: response.data.id,
            listName: response.data.listName,
          };
          setListEntity(updatedListEntity);
          setListArray([...listArray, updatedListEntity]);
        }
      } catch (error) {
        console.log(error)
        setListErrorText("List Does Not Exists")
        setShowListErrorText(true)
        setTimeout(() => {
          setShowListErrorText(false)
        }, 5000)
      }
      setListEntity({id: 0, listName: ""}); // Reset the input for the next list name
    }
  }

  const createGroup = async () => {
    
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    try {
      const mailIds = listArray.map(list => ({id: list.id}));
      const response = await API.post(`/groups/create-group`,
       {
        groupName: groupName,
        mailListIds: mailIds
       },
       {
        headers: {
          Authorization: `Bearer ${tok?.token}`
        }
       }
       );
       
       closeWithFunction()
       pageRefresh()
      } catch (error: any) {
        if(error.response.status === 409) {
         setGroupErrorText("Group With This Name Already Exists");
         setShowGroupErrorText(true);
        }
      console.log(error)
    }
    
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
      setListOptions(lists)
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getListsInfo()
  }, [])

  return (
    <>
    <div className='create-group-modal close' onClick={closeModal}>
        <div className="modal">
            <Stack spacing={4}>
              <TextField label="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} helperText={showGroupErrorText ? groupErrorText : null}/>

              <Stack spacing={2}>
                {/* <TextField label="List Name" onChange={(e) => setListEntity({listName: e.target.value, id: 24})} value={listEntity.listName} helperText={showListErrorText ? listErrorText : null}/> */}
                <Autocomplete
                options={listOptions}
                getOptionLabel={(list) => list?.listName}
                renderInput={(params) =>
                   (<TextField {...params}
                    label="Add List"  
                  />)
                  }
                onChange={(event, newValue) => setListEntity(newValue)}
                />
                <Stack direction="row" justifyContent="end">
                  <Button sx={{textTransform:"none"}} color='info' variant='outlined' onClick={addListNameToArray}>Add List To Group</Button>
                </Stack>
                <ol>
                  {listArray.map(list => {
                    return <li key={list.id}>{list.listName}</li>
                  })}
                </ol>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={3} position='absolute' width="90%" bottom="20px"  justifyContent="end">
              <Button sx={{textTransform:"none"}} variant="outlined" color="error" className='close' onClick={closeModal}>Cancel</Button>
              <Button sx={{textTransform:"none"}} variant='contained' onClick={createGroup}>Submit</Button>
            </Stack>
        </div>
    </div>
    </>
  )
}

export default CreateNewGroupModal