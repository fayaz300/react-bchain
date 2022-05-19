import '../styles/App.css';
import {useState, useEffect} from 'react';
import Menu from './Menu';
import PhlebotomistForm from './PhlebotomistForm';
import { AllBloodUnits } from './AllBloodUnits';
import Web3 from 'web3/dist/web3.min.js';
import {CONTACT_ABI, CONTACT_ADDRESS} from '../config';

function App() {
  const [accountDetails, setAccountDetails] = useState({account: null, isLogged: false});
  const [mainContent, setMainContent] = useState("allBloodUnits");
  const [web3, setWeb3] = useState(null)
  const [bloodContract, setBloodContract] = useState(null);
  const [allBloodPacketHashes, setAllBloodPacketHashes] = useState([]);
  
  useEffect(() => {
    async function load() {
      const web3Obj = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3Obj.eth.requestAccounts();
      setAccountDetails({account: accounts[0], isLogged: true});
      setWeb3(web3Obj);

      const bloodContract = new web3Obj.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);

      setBloodContract(bloodContract);

      const allBloodPacketHashes = await bloodContract.methods.getAllBloodPacketHashes().call();
      setAllBloodPacketHashes(allBloodPacketHashes);
      // for (var i = 1; i <= counter; i++) {
      //   const contact = await contactList.methods.contacts(i).call();
      //   setContacts((contacts) => [...contacts, contact]);
      // }
    }

    load();
  }, []);

  const mainContentChange = (childData) => {
    setMainContent(childData);
  };
  

  return (
    <div className="ui container">
      <Menu accountDetails={accountDetails} mainContentChange={mainContentChange}/>
      {accountDetails.isLogged && <h3>You are logged in as : {accountDetails.account}</h3>}
      {mainContent === "allBloodUnits" && <AllBloodUnits allBloodPacketHashes = {allBloodPacketHashes}/>}
      {mainContent === "phlebotomistForm" && <PhlebotomistForm />}
    </div>
  );
}

export default App;
