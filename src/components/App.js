import '../styles/App.css';
import {useState, useEffect} from 'react';
import Menu from './Menu';
import PhlebotomistForm from './PhlebotomistForm';
import { AllBloodUnits } from './AllBloodUnits';

function App() {
  const [accountDetails, setAccountDetails] = useState({account: null, isLogged: false});
  const [mainContent, setMainContent] = useState("allBloodUnits");
  

  const mainContentChange = (childData) => {
    setMainContent(childData);
  };
  

  return (
    <div className="ui container">
      <Menu accountDetails={accountDetails} mainContentChange={mainContentChange}/>
      {mainContent === "allBloodUnits" && <AllBloodUnits />}
      {mainContent === "phlebotomistForm" && <PhlebotomistForm />}
    </div>
  );
}

export default App;
