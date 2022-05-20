import { useState } from "react";

export const AllBloodUnits = (props) => {
  const [bloodPacket, setBloodPacket] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  function clickHandler(e) {
    const bpHash = e.currentTarget.textContent;
    props.showBloodPacketDetails(bpHash, 'bloodPacketDetails');
  }
  const allBloodPacketHashes = props.allBloodPacketHashes.map((bpHash) => {
    return (
      <div className="item" key={bpHash}>
        <div className="content">
          <span style={{cursor: "pointer"}} className="header link-primary" onClick={clickHandler}>{bpHash}</span>
        </div>
      </div>
    );
  });


  return (
    <div>
      <div className="ui relaxed divided list">{allBloodPacketHashes}</div>
    </div>);
};
