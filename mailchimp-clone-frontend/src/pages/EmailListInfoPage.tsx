import React, { SetStateAction, useEffect, useState } from 'react'
import SideMenu from '../components/SideMenu'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Table, TableHead, TableRow, TableBody, TableCell, Button, TablePagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API } from '../utils/API';

interface mailRecipient {
  id: number,
  emailAddress: string
}

const EmailListInfoPage = () => {


  const {id, name} = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElementsCount, setTotalElementsCount] = useState<number>(0);
  const [recipientList, setRecipientList] = useState<mailRecipient[]>([]);
  const emptyRow: mailRecipient = { id: 0, emailAddress: "                  " };

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getListsInfo = async () => {
    const jwt = localStorage.getItem("jwtToken");
    const tok = JSON.parse(jwt || "");
    try {
      const response = await API.get(
        `/groups/mail-list/recipients-list?listId=${id}&pageNumber=${page}&pageSize=${rowsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        }
      );
      console.log(response);
      const recipients = response.data.content.map((recipient: any) => {
        return {
          id: recipient.id,
          emailAddress: recipient.emailAddress,
        }
      });
      if(recipients.length < rowsPerPage) {
        const count = rowsPerPage - recipients.length;
        const emptyRows = [];
        for(let i = 0; i < count; i++) {
          emptyRows.push(emptyRow);
        }

        recipients.push(...emptyRows);
      }
      setRecipientList(recipients);
      setTotalElementsCount(response.data.totalElements);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getListsInfo()
  }, [page, setPage, rowsPerPage, setRowsPerPage])

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
                  <h1 className="title">{name}
                  <button><EditIcon color='info'/></button></h1>
                  
              </div>

              <div className="table-section">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='left'>id</TableCell>
                      <TableCell align='left'>Email Address</TableCell>
                      <TableCell align='left'>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recipientList.map(row => {
                     if(row.id !== 0) {
                      return <TableRow>
                        <TableCell align='left'>{row.id}</TableCell>
                        <TableCell align='left'>{row.emailAddress}</TableCell>
                        <TableCell align='left'> <button className='action-btn'><DeleteIcon /></button></TableCell>
                      </TableRow>
                     } else {
                      return <TableRow>
                        <TableCell align='left'></TableCell>
                        <TableCell align='left'></TableCell>
                        <TableCell align='left'><button className='action-btn'></button></TableCell>
                      </TableRow>
                     }
                    })}
                  </TableBody>
                </Table>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalElementsCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
              </div>
          </div>


      </div></>
  )
}

export default EmailListInfoPage