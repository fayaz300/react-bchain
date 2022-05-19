import '../styles/App.css';
import {useState, useEffect} from 'react';
import Menu from './Menu';
import PhlebotomistForm from './PhlebotomistForm';

function App() {
  const [accountDetails, setAccountDetails] = useState({account: null, isLogged: false});
  const [mainContent, setMainContent] = useState("allBloodUnits");
  

  const mainContentChange = (childData) => {
    setMainContent(childData);
  };
  

  return (
    <div className="ui container">
      <Menu accountDetails={accountDetails} mainContentChange={mainContentChange}/>
      {mainContent === "phlebotomistForm" && <PhlebotomistForm />}
    </div>
  );
}

export default App;
