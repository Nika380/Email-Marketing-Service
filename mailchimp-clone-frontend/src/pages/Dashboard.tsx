import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {Helmet} from 'react-helmet';
import { useEffect, useState } from 'react';
import BulkMailModal from '../modals/BulkMailModal';
import BombEmailModal from '../modals/BombEmailModal';

const bulkMail = require('../images/bulk-email.png');
const bombMail = require('../images/bomb-email.png');


const Dashboard = () => {
  const navigate = useNavigate();

  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showBombMailModal, setShowBombMailModal] = useState<boolean>(true);
  const openBulkModal = () => {
    setShowBulkModal(true);
  } 
  const closeBulkModal = () => {
    setShowBulkModal(false);
  }

  const openBombMailModal = () => {
    setShowBombMailModal(true);
  } 
  const closeBombMailModal = () => {
    setShowBombMailModal(false);
  }

  return (
    <>
    <Header />
      <div className='dashboard'>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="send-mails-section" >
          <div className="bulk-mail" onClick={openBulkModal}>
            <h1 className="title">Send Bulk Emails</h1>
            <img src={bulkMail} alt="" />
          </div>
          {showBulkModal && <BulkMailModal closeModal={closeBulkModal}/>}
          <div className="bomb-mail" onClick={openBombMailModal}>
            <h1 className="title">Bomb Email</h1>
            <img src={bombMail} alt="" />
          </div>
          {showBombMailModal && <BombEmailModal closeBombModal={closeBombMailModal} />}
        </div>

      </div>
    </>
  );
};

export default Dashboard;
