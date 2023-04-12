import "./styles/styles.scss"
import { BrowserRouter} from 'react-router-dom';
import RouteComp from './routes/RouteComp';

function App() {
  

  
  return (
      <BrowserRouter>
        <RouteComp />
      </BrowserRouter>
  );
}

export default App;
