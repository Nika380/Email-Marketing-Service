import { Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { API } from '../utils/API';

interface Email {
  emailAddress: string;
}

const CreateNewListModal = ({ closeModal, pageRefresh, closeWithFunction }: any) => {
  const [emailList, setEmailList] = useState<Email[]>([]);
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [listName, setListName] = useState<string>('');
  const [showAddressError, setShowAddressError] = useState<boolean>(false);
  const [addressErrorText, setAddressErrorText] = useState<string>('');

  const addEmailToList = () => {
    if (emailAddress.includes('@') && emailAddress.includes('.com')) {
      setEmailList([...emailList, { emailAddress }]);
      setEmailAddress('');
      setShowAddressError(false);
    } else {
      setAddressErrorText('Input Does Not Look Like a Valid Email');
      setShowAddressError(true);
    }
  };


  const createNewList = async () => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    try {
      const response = await API.post(`/groups/create-list`,
       {
        listName: listName,
        mailRecipients: emailList
       },
       {
        headers: {
          Authorization: `Bearer ${tok?.token}`
        }
       }
       );
       console.log(response)
       closeWithFunction()
       pageRefresh()
      } catch (error: any) {
        if(error.response.status === 409) {
        //  setGroupErrorText("Group With This Name Already Exists");
        //  setShowGroupErrorText(true);
        }
      console.log(error)
    }
  }

  return (
    <div className='create-list-modal close' onClick={closeModal}>
      <div className='modal'>
        <Stack spacing={3}>
          <TextField
            label='List Name'
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />

          <TextField
            label='Email Address To add in list'
            type='email'
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            helperText={showAddressError ? addressErrorText : null}
          />
          <Stack direction='row' justifyContent='end'>
            <Button
              sx={{ textTransform: 'none' }}
              variant='outlined'
              onClick={addEmailToList}
            >
              Add Email To List
            </Button>
          </Stack>
        </Stack>

        <ol>
          {emailList.map((email, index) => (
            <li key={index}>{email.emailAddress}</li>
          ))}
        </ol>
        <Stack
          spacing={3}
          direction='row'
          position='absolute'
          bottom='20px'
          justifyContent='end'
          width='90%'
        >
          <Button
            sx={{ textTransform: 'none' }}
            color='error'
            variant='outlined'
            onClick={closeModal}
            className='close'
          >
            Cancel
          </Button>
          <Button sx={{ textTransform: 'none' }} variant='contained' onClick={createNewList}>
            Submit
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default CreateNewListModal;
