import '../styles/App.css';
import {useState, useEffect} from 'react';
import Menu from './Menu';
import PhlebotomistForm from './PhlebotomistForm';
import BloodPacketDetails from './BloodPacketDetails';
import { AllBloodUnits } from './AllBloodUnits';
import Web3 from 'web3/dist/web3.min.js';
import {CONTACT_ABI, CONTACT_ADDRESS} from '../config';

function App() {
  const [accountDetails, setAccountDetails] = useState({account: null, isLogged: false, isPhlebotomist: false});
  const [mainContent, setMainContent] = useState("allBloodUnits");
  const [web3, setWeb3] = useState(null)
  const [bloodContract, setBloodContract] = useState(null);
  const [allBloodPacketHashes, setAllBloodPacketHashes] = useState([]);
  const [bpHash, setBpHash] = useState(null);

  async function load() {
    const web3Obj = new Web3(Web3.givenProvider || "http://localhost:7545");
    const accounts = await web3Obj.eth.requestAccounts();
    
    setWeb3(web3Obj);
    const bloodContract = new web3Obj.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
    const isUserPhlebotomist = await bloodContract.methods.isPhlebotomist().call({from: accounts[0]});
    setAccountDetails({account: accounts[0], isLogged: true, isPhlebotomist: isUserPhlebotomist});

    setBloodContract(bloodContract);
    const allBloodPacketHashes = await bloodContract.methods.getAllBloodPacketHashes().call();
    setAllBloodPacketHashes(allBloodPacketHashes);
  }
  useEffect(() => {
    load();
  }, []);

  const mainContentChange = (childData) => {
    setMainContent(childData);
  };

  const showBloodPacketDetails = (bpHash, mainContentData) => {
    setMainContent(mainContentData);
    setBpHash(bpHash);
  } 
  
  const disconnectWallet = () => {
    if(accountDetails.isLogged) {
      setAccountDetails({account: null, isLogged: false})
    }
  }
  return (
    <div className="ui container">
      <Menu accountDetails={accountDetails} mainContentChange={mainContentChange} disconnectWallet={disconnectWallet}/>
      {accountDetails.isLogged && <h3>You are logged in as : {accountDetails.account}</h3>}
      <br />
      <br />
      {mainContent === "allBloodUnits" && <AllBloodUnits allBloodPacketHashes = {allBloodPacketHashes} bloodContract={bloodContract} showBloodPacketDetails={showBloodPacketDetails}/>}
      {mainContent === "phlebotomistForm" && <PhlebotomistForm bloodContract={bloodContract} accountDetails = {accountDetails}/>}
      {mainContent === "bloodPacketDetails" && <BloodPacketDetails bpHash={bpHash} bloodContract={bloodContract} accountDetails={accountDetails}/>}
    </div>
  );
}

export default App;
