import '../styles/App.css';
import Menu from './Menu';
import {useState, useEffect} from 'react';
// import {CONTRACT_ABI, CONTRACT_ADDRESS} from '../config';

function App() {
  const [accountDetails, setAccountDetails] = useState({account: null, isLogged: false});


  return (
    <div className="ui container">
      <Menu accountDetails={accountDetails}/>
    </div>
  );
}

export default App;
