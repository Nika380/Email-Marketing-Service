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

interface mailList{
    id: number,
    mailRecipients: mailRecipients[]
}

interface mailRecipients {
    id: number,
    emailAddress: string
}

const GroupInfoPage = () => {
    const navigate = useNavigate();
    const { id, name } = useParams<{ id: string, name: string }>();
    const groupId = parseInt(id || "");
    const [showGroupChangeModal, setShowGroupChangeModal] = useState<boolean>(false);
    // const [groupName1, setGroupName1] = useState<string>(name || "");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [mailList, setMailList] = useState<mailList[]>([]);
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const {groupName, setGroupName}: any = useContext(ChangeGroupNameContext);


    

    const closeGroupChangeModal = (event: any) => {
        if(event.target.classList.contains("close")) {
            setShowGroupChangeModal(false);
        }
    }

    const openGroupChangeModal = () => {
        setShowGroupChangeModal(true);
    }

    const saveNewGroupName = async (newName: string) => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        try {
            const response = await API.post(`/groups/change-name/${id}`, 
            {
                newGroupName: newName
            },
            {
                headers: {
                    Authorization: `Bearer ${tok?.token}`
                }
            }
            );
            setGroupName(newName);
        } catch (error) {
            console.log(error)
        }
        setShowGroupChangeModal(false);
    }
  
    const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const getGroupData = async () => {
        const jwt = localStorage.getItem("jwtToken");
        const tok = JSON.parse(jwt || "");
        try {
          const response = await API.get(
            `/groups/group/${id}`,
            {
              headers: {
                Authorization: `Bearer ${tok?.token}`
              }
            }
          );
          setMailList(response.data.bulkMailLists)
          setIsLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGroupData();
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
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                        <TableBody>
                            {mailList?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                let emailId = 0;
                                return row.mailRecipients.map((recipient) => {
                                    emailId++;
                                return (
                                    <TableRow key={recipient?.id}>
                                    <TableCell>{emailId}</TableCell>
                                    <TableCell>{recipient?.emailAddress}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                        <button className="action-btn">
                                            <EditIcon color="info" />
                                        </button>
                                        <button className="action-btn">
                                            <DeleteIcon color="error" />
                                        </button>
                                        </Stack>
                                    </TableCell>
                                    </TableRow>
                                );
                                });
                            })}
                        </TableBody>

                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={7}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
            </div>
            {isLoading && 
            <div className='loading-info'><LoadingCube /> <h1>Loading ...</h1></div>}
            
        </div>
            {showGroupChangeModal && <ChangeGroupNameModal onModalClose={closeGroupChangeModal} groupName={groupName} setGroupName={setGroupName} saveNewName={saveNewGroupName}/>}
    
    
    
    </>
  )
}

export default GroupInfoPage