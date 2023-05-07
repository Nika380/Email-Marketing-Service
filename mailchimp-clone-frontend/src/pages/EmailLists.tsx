import React, { useEffect, useState } from 'react'
import SideMenu from '../components/SideMenu'
import EmailListComponent from '../components/EmailListComponent'
import { API } from '../utils/API'
import Button from '@mui/material/Button/Button'
import CreateNewListModal from '../modals/CreateNewListModal'
import { CircularProgress } from '@mui/material'
import { Helmet } from 'react-helmet'
import LoadingCube from '../loading-animation/LoadingCube'


interface listComponent {
  id: number,
  listName: string,
  emailCount: number
}

const EmailLists = () => {

  const [emailListsComponentList, setEmailListsComponentList] = useState<listComponent[]>([]);
  const [showCreateListModal, setShowCreateListModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("sadsadsad");
  const [infoLoading, setInfoLoading] = useState<boolean>(false);

  const closeCreateListModal = (event: any) => {
    if(event.target.classList.contains("close")) {
      setShowCreateListModal(false);
  }
  }

  const openCreateListModal = () => {
    setShowCreateListModal(true);
  }

  const closeWithFunction = () => {
    setShowCreateListModal(false);
  }

  const refreshPage = () => {
    window.location.reload();
  }

  const deleteList = () => {
    setLoadingText("Deleting List, please wait ...");
    setIsLoading(true);
  }
  const deletedSuccessfully = () => {
    setLoadingText("List Deleted Successfully");
    setTimeout(() => {
      setIsLoading(false);
    }, 2500)
  }

  const getListsInfo = async () => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    setInfoLoading(true);
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
          listName: list.listName,
          emailCount: list.mailRecipients.length
        }
      });
      setEmailListsComponentList(lists);
      setInfoLoading(false);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getListsInfo()
  }, [])
  return (
    <>
    <Helmet>
      <title>Email List</title>
    </Helmet>
    <div className='email-list'>
        <SideMenu page={"email-lists"}/>
        
        
        <div className="content">

          <div className="header">
            <h1 className="title">Email Lists</h1>
            <Button sx={{textTransform:"none", position:'relative', left:'200px', top:'10px'}} variant='contained' color='success' onClick={openCreateListModal}>Create New List</Button>
          </div>

          <div className="email-components-list">
            {emailListsComponentList.map(component => {
              return <EmailListComponent key={component.id} listName={component.listName} id={component.id} emailCount={component.emailCount} pageRefresh={refreshPage} loadingFunction={deleteList} deletedSuccessfully={deletedSuccessfully}/>
            })}
          </div>
        </div>
    </div>
    {showCreateListModal && <CreateNewListModal closeModal={closeCreateListModal} closeWithFunction={closeWithFunction} pageRefresh={refreshPage}/>}
    {isLoading &&
      <div className="loading">
        <CircularProgress color='secondary' />
        <h1>{loadingText}</h1>
      </div>
    }

    {infoLoading &&
      <div className='loading-info'><LoadingCube /> <h1>Loading ...</h1></div>
    }
    </>
  )
}

export default EmailLists