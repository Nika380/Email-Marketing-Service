import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('jwtToken')
    navigate('/')
  }

  

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <button onClick={logOut}>Log out</button>
    </div>
  );
};

export default Dashboard;
