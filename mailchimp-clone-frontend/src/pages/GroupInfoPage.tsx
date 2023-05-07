import { Helmet } from 'react-helmet'
import SideMenu from '../components/SideMenu'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import ChangeGroupNameModal from '../modals/ChangeGroupNameModal';
import { API } from '../utils/API';
import LoadingCube from '../loading-animation/LoadingCube';
import ChangeGroupNameContext from '../context/NameChangeContext';
import { DataGrid, GridPaginationModel, GridValueGetterParams, GridToolbarExport  } from '@mui/x-data-grid';

interface mailList{
    id: number,
    mailRecipients: mailRecipients[]
}

interface mailRecipients {
    id: number,
    displayId: number,
    emailAddress: string
}

const CustomToolBar = () => {
    return (
        <Stack direction="row" justifyContent="end">
            <Tooltip title="Export Table Data">
                <GridToolbarExport
                csvOptions={{ fileName: 'email-list-in-group' }}
                />
             </Tooltip>
        </Stack>
    )
}

const GroupInfoPage = () => {
    const navigate = useNavigate();
    const { id, name } = useParams<{ id: string, name: string }>();
    const [showGroupChangeModal, setShowGroupChangeModal] = useState<boolean>(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [mailList, setMailList] = useState<mailRecipients[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const {groupName, setGroupName}: any = useContext(ChangeGroupNameContext);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(0);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
      });
    let emailId = 0;
    const columns = [
        {
            field: "displayId",
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


    

    const closeGroupChangeModal = (event: any) => {
        if(event.target.classList.contains("close")) {
            setShowGroupChangeModal(false);
        }
    }

    const openGroupChangeModal = () => {
        setShowGroupChangeModal(true);
    }

    
    const handleChangeRowsPerPage = async (newPaginationModel: GridPaginationModel) => {
        await getGroupData({
          pageSize: newPaginationModel.pageSize,
          pageNumber: newPaginationModel.page,
        });
        setPageNumber(newPaginationModel.page);
        setRowsPerPage(newPaginationModel.pageSize);
        setPaginationModel(newPaginationModel);
      };
      

    const getGroupData = async ({pageSize, pageNumber}: any) => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        try {
          const response = await API.get(
            `/groups/mails-list/paging?groupId=${id}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
            {
              headers: {
                Authorization: `Bearer ${tok?.token}`
              }
            }
          );
          emailId = 0;
          const updatedMailList = response.data.content.map((email: { id: number, emailAddress: string }) => {
            emailId++;
            return {
                id: email.id,
                displayId: emailId,
                emailAddress: email.emailAddress
            }
          })
          setTotalElements(response.data.totalElements)
          setMailList(updatedMailList)
          setIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGroupData({pageNumber: pageNumber, pageSize: rowsPerPage});
    }, [id])

    useEffect(() => {
        setGroupName(name);
    }, [])

  return (
    <><Helmet>
        <title>Group Info</title>
      </Helmet>

            <SideMenu page={"groups"} />

        <div className='group-info'>
            <button className='go-back-btn' onClick={() => navigate(-1)}>Go Back</button>

            <div className="header">
                <h1>{groupName}
                <Tooltip title="Edit Group Name">
                    <button onClick={openGroupChangeModal} className='name-edit-btn'><EditIcon color='info' sx={{width: "100%", height:"30px"}}/></button>
                </Tooltip>
                </h1>
                
            </div>

            <div className="table-section">
                <DataGrid 
                    columns={columns}
                    rows={mailList}
                    pagination
                    paginationMode="server"
                    onPaginationModelChange={handleChangeRowsPerPage}
                    paginationModel={paginationModel}
                    initialState={{
                        
                        pagination: {paginationModel:
                             {pageSize: rowsPerPage, page:pageNumber}}
                    }
                    }
                    
                    pageSizeOptions={[10,25, 50, 100]}
                    rowCount={totalElements}
                    slots={{
                        toolbar: CustomToolBar
                    }}
                    
                />
            </div>
            {isLoading && 
            <div className='loading-info'><LoadingCube /> <h1>Loading ...</h1></div>}
            
        </div>
            {showGroupChangeModal && <ChangeGroupNameModal onModalClose={closeGroupChangeModal} groupName={groupName} setGroupName={setGroupName} setShowGroupChangeModal={setShowGroupChangeModal} id={id}/>}
    
    
    
    </>
  )
}

export default GroupInfoPage