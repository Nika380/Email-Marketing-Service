import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GroupsIcon from '@mui/icons-material/Groups';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';


const SideMenu = ({page}: any) => {
    const navigate = useNavigate();
    const {auth, setAuth} = useContext(AuthContext);
    const logOut = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem("refreshToken");
        setAuth(false);
        navigate('/')
      }
  return (
    <div className='side-menu'>
        <ul className="pages-list">
            <li className={page === "dashboard" ? "on-page" : ""}><Link to={'/dashboard'} className="link"><DashboardIcon className='icon'/> Dashboard </Link></li>
            <li className={page === "groups" ? "on-page" : ""}> <Link to={"/groups"} className="link"> <GroupsIcon className='icon'/>Groups</Link></li>
            <li className={page === "email-lists" ? "on-page" : ""}> <Link to={'/email-lists'} className="link"><FormatListBulletedIcon className='icon' />  Email Lists</Link></li>
        </ul>

        <div className="account-menu">
            <AccountMenu logOutFunction={logOut}/>
        </div>
    </div>
  )
}

export default SideMenu




function AccountMenu({logOutFunction}: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>NN</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: -11.5,
            ml: 3,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(50%) rotate(-45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={logOutFunction}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
