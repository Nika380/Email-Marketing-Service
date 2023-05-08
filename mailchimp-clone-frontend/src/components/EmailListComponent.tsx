import { Button, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import { API } from '../utils/API';

const EmailListComponent = ({listName, id, emailCount, pageRefresh, deletedSuccessfully, loadingFunction}: any) => {
    const navigate = useNavigate();

    const deleteList = async () => {
      const jwt = localStorage.getItem("jwtToken");
      const tok = JSON.parse(jwt || "");
      loadingFunction();
      // setRefreshPage(false)
      try {
        const response = await API.delete(`/groups/delete-list/${id}`, {
          headers: {
            Authorization: `Bearer ${tok?.token}`
          }
        });
        deletedSuccessfully();
        setTimeout(() => {
          pageRefresh();
        }, 3000)
        // setRefreshPage(true)
      } catch(error) {
        console.log(error);
      }
    };
  return (
    <div className='email-list-component' onDoubleClick={() => navigate(`/email-lists/${id}/${listName}`)}>
          <Tooltip title="Delete List">
            <Button variant="outlined" color="error" sx={{position:"absolute", top:'15px', right:'30px'}} onClick={deleteList} ><DeleteIcon /></Button>
          </Tooltip>
        <ul>
            <li>List Name: </li>
            <li>{listName}</li>
        </ul>

        <ul>
            <li>Email Address Count: </li>
            <li>{emailCount}</li>
        </ul>

    </div>
  )
}

export default EmailListComponent