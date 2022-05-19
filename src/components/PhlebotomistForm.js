import { useState } from "react";

const PhlebotomistForm = (props) => {
  const [serialNum, setSerialNum] = useState('');
  const [donorId, setDonorId] = useState('');
  const [collectedDate, setCollectedDate] = useState('');
  const [collectedLocation, setCollectedLocation] = useState('');
  const [txRes, setTxRes] = useState('');

  function handleAddBloodUnit() {
    const _serialNum = serialNum;
    const _donorId = donorId;
    const _collectedDate = collectedDate;
    const _collectedLocation = collectedLocation;

    async function addBloodUnit() {
      const account = props.accountDetails.account;
      const bloodContract = props.bloodContract;
      
      const tx = await bloodContract.methods.makeBloodPacket(_serialNum, _donorId, _collectedDate, _collectedLocation).send(
        {
          from: account,
          gas: '500000',
        }
      )
      setTxRes(txRes);
      console.log(tx);
    }
    
    addBloodUnit();
  }
  return (
    <div className="ui main">
      <form className="ui form" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor="serialNum">Serial Number</label>
          <input
            type="text"
            id="serialNum"
            name="serialNum"
            placeholder="Enter Serial Num"
            value={serialNum}
            onChange={(e) => setSerialNum(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="donorId">Donor Id:</label>
          <input
            type="text"
            id="donorId"
            name="donorId"
            placeholder="Enter Donor-id"
            value={donorId}
            onChange={(e) => setDonorId(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="collectedDate">Collected Date-Time:</label>
          <input
            type="datetime-local"
            id="collectedDate"
            name="collectedDate"
            placeholder="Enter Date-Time"
            value={collectedDate}
            onChange={(e) => setCollectedDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="collectedLocation">Collected Location:</label>
          <input
            type="text"
            id="collectedLocation"
            name="collectedLocation"
            placeholder="Enter Collected-location"
            value={collectedLocation}
            onChange={(e) => setCollectedLocation(e.target.value)}
          />
        </div>
        <button className="ui button compact blue" onClick={handleAddBloodUnit}>Add to Blockchain</button>
      </form>
      {txRes !== '' && <h5>{txRes}</h5>}
    </div>
  );
};

export default PhlebotomistForm;
