import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import {Helmet} from 'react-helmet';

const bulkMail = require('../images/bulk-email.png');
const bombMail = require('../images/bomb-email.png');


const Dashboard = () => {
  const navigate = useNavigate();



  

  return (
    <>
    <Header />
      <div className='dashboard'>
        <Helmet>
          <title>Dashboard</title>
        </Helmet>
        <div className="send-mails-section">
          <div className="bulk-mail">
            <h1 className="title">Send Bulk Emails</h1>
            <img src={bulkMail} alt="" />
          </div>

          <div className="bomb-mail">
            <h1 className="title">Bomb Email</h1>
            <img src={bombMail} alt="" />
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
