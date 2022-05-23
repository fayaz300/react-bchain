import { useState } from "react";

const BloodPacketDetails = (props) => {
  const [bloodPacketDetails, setBloodPacketDetails] = useState({});
  const [allLocations, setAllLocations] = useState([]);
  const [location, setLocation] = useState('');
  const bpHash = props.bpHash;
  const bloodContract = props.bloodContract;
  const account = props.accountDetails.account;
  const statusFinder = {
    0: "NotReady",
    1: "ReadyforDelivery",
    2: "StartDelivery",
    3: "OnTrack",
    4: "EndDelivery",
    5: "Deposited",
    6: "ReadyForSupply",
    7: "OnTrackToHospital",
    8: "EndFinalDelivery",
    9: "Received"
  }

  bloodContract.methods
    .getAllBloodPackets(bpHash)
    .call()
    .then((data) => {
      setBloodPacketDetails({
        phlebotomist: data.phlebotomist,
        serialNumber: data.serialNumber,
        donorId: data.donorId,
        collectedDate: data.collectedDate,
        collectedLocation: data.collectedLocation,
        rawStatus: data.status,
        currentStatus: statusFinder[data.status],
        currentOwner: data.owner,
      });
    });

  bloodContract.methods.getAllLocations(bpHash).call().then( (data) => {
    const arr = data.map( item => {
      return (
        <div className="item" key={item}>
          <div className="content">
            <span className="header ">{item}</span>
          </div>
        </div>
      )
    });
    setAllLocations(arr);
  })
  
  function clickHandler() {
    const date = new Date().toJSON().split("T")[0];
    const loc = location;
    const rawStatus = bloodPacketDetails.rawStatus;
    async function updateStatus() {
      console.log(typeof rawStatus)
      if (rawStatus === "0") {
        // call makeReadyForDelivery method;
        const res = await bloodContract.methods.makeReadyForDelivery(bpHash).send({from:account, gas: 500000})
        // console.log(res);
      }
      else if (rawStatus === "1") {
        // call startDelivery method;
        const res = await bloodContract.methods.startDelivery(bpHash, date, loc).send({from:account, gas: 500000})
        // console.log(res);
      }
      else if (rawStatus === "2") {
        
        const res = await bloodContract.methods.updateDeliveryStatus(bpHash, date, loc).send({from:account, gas: 500000})
        // console.log(res);
      }
      // else if (rawStatus === "3") {
        
      //   const res = await bloodContract.methods.endDelivery(bpHash, date, loc).send({from:account, gas: 500000})
      //   // console.log(res);
      // }
      // else if (rawStatus === "4") {
        
      //   const res = await bloodContract.methods.makeReadyForSupply(bpHash, date, loc).send({from:account, gas: 500000})
      //   console.log(res);
      // }
      // else if (rawStatus === "5") {
        
      //   const res = await bloodContract.methods.startDistribution(bpHash, date, loc).send({from:account, gas: 500000})
      //   console.log(res);
      // }
      // else if (rawStatus === "6") {
        
      //   const res = await bloodContract.methods.endFinalDelivery(bpHash, date, loc).send({from:account, gas: 500000})
      //   console.log(res);
      // }
      // else if (rawStatus === "7") {
        
      //   const res = await bloodContract.methods.receivedBloodPacket(bpHash, date, loc).send({from:account, gas: 500000})
      //   console.log(res);
      // }
      // TODO implement remaining
    }
    updateStatus();
  }
  return (
    <>
      <div>
        <h4>Blood Unit Details:</h4>
        <p>hash: {props.bpHash}</p>
        <p><span className="font-weight-bold">Phlebotomist: </span>{bloodPacketDetails.phlebotomist}</p>
        <p><span className="font-weight-bold">Serial Number: </span>{bloodPacketDetails.serialNumber}</p>
        <p><span className="font-weight-bold">Donor Id: </span>{bloodPacketDetails.donorId}</p>
        <p><span className="font-weight-bold">Collected Date: </span> {bloodPacketDetails.collectedDate}</p>
        <p><span className="font-weight-bold">Collected Location: </span> {bloodPacketDetails.collectedLocation}</p>
        <p><span className="font-weight-bold">Current Status: </span>{bloodPacketDetails.currentStatus}</p>
        <p><span className="font-weight-bold">Current Owner: </span> {bloodPacketDetails.currentOwner}</p>
      </div>
      <div className="ui secondary menu">
        <form className="ui form">
          <div className="ui item">
            <label htmlFor="location">Location:</label><br />
            <input type="text" onChange={(e) => setLocation(e.target.value)}></input>
          </div>
        </form>
        <div className="item">
          <button className="ui button compact positive" onClick={clickHandler}>Update Status</button>
        </div>
      </div>
      <div>
        <h4>Blood Unit History: </h4>
        <div className="item">{allLocations}</div>
      </div>
    </>
  );
};

export default BloodPacketDetails;
