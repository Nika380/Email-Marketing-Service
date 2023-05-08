import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import SideMenu from '../components/SideMenu'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableHead, TableRow, TableBody, TableCell, Button, TablePagination, Stack, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API } from '../utils/API';
import LoadingCube from '../loading-animation/LoadingCube';
import { DataGrid, GridPaginationModel, GridToolbarExport } from '@mui/x-data-grid';
import ChangeListNameModal from '../modals/ChangeListNameModal';
import ListNameChangeContext from '../context/ListNameChangeContext';
import AddEmailToListDrawer from '../modals/AddEmailToListDrawer';

interface mailRecipient {
  id: number,
  idToDisplay: number,
  emailAddress: string
}

const CustomToolBar = () => {
  return (
    <Stack direction="row" justifyContent="end">
      <Tooltip title="Export Table Data">
        <GridToolbarExport csvOptions={{ fileName: 'Email-Address-List' }} />
      </Tooltip>
    </Stack>
  );
};



const EmailListInfoPage = () => {


  const {id, name} = useParams();
  const {listName, setListName}: any = useContext(ListNameChangeContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElementsCount, setTotalElementsCount] = useState<number>(0);
  const [recipientList, setRecipientList] = useState<mailRecipient[]>([]);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });
  const [showListNameChangeModal, setShowListNameChangeModal] = useState<boolean>(false);

  const columns = [
    {
      field: "idToDisplay",
      headerName: "ID",
      sortable: false, filterable: false
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      width: 300,
      sortable: false
    }
  ]

  const openListNameChangeModal = () => {
    setShowListNameChangeModal(true);
  }

  const closeListNameChangeModal = (event: any) => {
    if(event.target.classList.contains("close")) {
      setShowListNameChangeModal(false);
    }
  }

  const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
    setRowsPerPage(newPaginationModel.pageSize);
    setPage(newPaginationModel.page)
    setPaginationModel(newPaginationModel);
  }



  const getListsInfo = async ({pageNumber, pageSize}: any) => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    setInfoLoading(true);
    try {
      const response = await API.get(
        `/groups/mail-list/recipients-list?listId=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        }
      );
      let emailId = 0;
      const recipients = response.data.content.map((recipient: any) => {
        emailId++;
        return {
          id: recipient.id,
          idToDisplay: emailId,
          emailAddress: recipient.emailAddress,
        }
      });
      
      setRecipientList(recipients);
      setInfoLoading(false);
      setTotalElementsCount(response.data.totalElements);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getListsInfo({pageNumber: page, pageSize: rowsPerPage})
  }, [page, setPage, rowsPerPage, setRowsPerPage])

  useEffect(() => {
    setListName(name);
  }, [])
  

  return (
        <>
        <Helmet>
          <title>Email List Info Page</title>
        </Helmet>
        <SideMenu page={"email-lists"}/>

        <div className='email-list-info-page'>
        <button className='go-back-btn' onClick={() => navigate(-1)}>Go Back</button>

          <div className="content">

              <div className="header">
                  <h1 className="title">{listName}
                  <Tooltip title="Change List Name">
                    <button onClick={openListNameChangeModal}><EditIcon color='info'/></button>
                  </Tooltip>
                  
                  </h1>
                  <AddEmailToListDrawer listId={id}/>
              </div>

              <div className="table-section">
                <DataGrid
                columns={columns}
                rows={recipientList}
                pagination
                paginationMode='server'
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                rowCount={totalElementsCount}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {paginationModel: 
                  {pageSize: rowsPerPage, page: page}}
                }}
                slots={{
                  toolbar: CustomToolBar
                }}
                />
              </div>
          </div>


      </div>
      {infoLoading &&
      <div className='loading-info'><LoadingCube /> <h1>Loading ...</h1></div>
    }
    {showListNameChangeModal && <ChangeListNameModal id={id} onModalClose={closeListNameChangeModal} listName={listName} setListName={setListName} setShowListNameChangeModal={setShowListNameChangeModal}/>}
      </>
  )
}

export default EmailListInfoPage

