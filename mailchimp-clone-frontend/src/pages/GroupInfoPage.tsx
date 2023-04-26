import { Helmet } from 'react-helmet'
import SideMenu from '../components/SideMenu'
import { useNavigate } from 'react-router-dom'
import { Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SetStateAction, useState } from 'react';
import ChangeGroupNameModal from '../modals/ChangeGroupNameModal';

const rows = [
    {
        id: 1,
        email: "test@gmail.com"
    },
    {
        id: 2,
        email: "test2@gmail.com"
    },
    {
        id: 3,
        email: "test3@gmail.com"
    },
    {
        id: 4,
        email: "test4@gmail.com"
    },
    {
        id: 5,
        email: "test5@gmail.com"
    },
    {
        id: 1,
        email: "test@gmail.com"
    },
    {
        id: 2,
        email: "test2@gmail.com"
    }
]

const GroupInfoPage = () => {
    const navigate = useNavigate();
    const [showGroupChangeModal, setShowGroupChangeModal] = useState<boolean>(false);
    const [groupName, setGroupName] = useState<string>("Some Name");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    

    const closeGroupChangeModal = (event: any) => {
        if(event.target.classList.contains("close")) {
            setShowGroupChangeModal(false);
        }
    }

    const openGroupChangeModal = () => {
        setShowGroupChangeModal(true);
    }

    const saveNewGroupName = (newName: SetStateAction<string>) => {
        setGroupName(newName);
        setShowGroupChangeModal(false);
    }
  
    const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  return (
    <><Helmet>
        <title>Group Info</title>
      </Helmet>

            <button className='go-back-btn' onClick={() => navigate(-1)}>Go Back</button>
            <SideMenu page={"groups"} />

        <div className='group-info'>

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
                        
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
                            return (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>
                                        <Stack direction='row' spacing={2}>
                                        <button className='action-btn'><EditIcon color='info' /></button>
                                        <button className='action-btn'><DeleteIcon color='error' /></button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )
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
            
            {showGroupChangeModal && <ChangeGroupNameModal onModalClose={closeGroupChangeModal} groupName={groupName} saveNewName={saveNewGroupName}/>}
        </div>
    
    
    
    </>
  )
}

export default GroupInfoPage