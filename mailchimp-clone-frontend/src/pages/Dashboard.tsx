import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {Helmet} from 'react-helmet';
import { useEffect, useState } from 'react';
import BulkMailModal from '../modals/BulkMailModal';
import BombEmailModal from '../modals/BombEmailModal';
import SideMenu from '../components/SideMenu';
import { API } from '../utils/API';

const bulkMail = require('../images/bulk-email.png');
const bombMail = require('../images/bomb-email.png');

const Dashboard = () => {
  const navigate = useNavigate();

  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showBombMailModal, setShowBombMailModal] = useState<boolean>(false);
  const openBulkModal = () => {
    setShowBulkModal(true);
  } 
  const closeBulkModal = (event: any) => {
    if(event.target.classList.contains("close")) {
      setShowBulkModal(false);
  }
  }

  const openBombMailModal = () => {
    setShowBombMailModal(true);
  } 
  const closeBombMailModal = (event: any) => {
    if(event.target.classList.contains("close")) {
      setShowBombMailModal(false);
  }
  }



  return (
    <>
    <SideMenu page={'dashboard'}/>
      <div className='dashboard'>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="send-mails-section" >
          <div className="bulk-mail" onClick={openBulkModal}>
            <h1 className="title">Send Bulk Emails</h1>
            <img src={bulkMail} alt="" />
          </div>
          <div className="bomb-mail" onClick={openBombMailModal}>
            <h1 className="title">Bomb Email</h1>
            <img src={bombMail} alt="" />
          </div>
        </div>

      </div>
      {showBulkModal && <BulkMailModal closeModal={closeBulkModal} groupToSendMail=""/>}
      {showBombMailModal && <BombEmailModal closeBombModal={closeBombMailModal} />}

    </>
  );
};

export default Dashboard;
