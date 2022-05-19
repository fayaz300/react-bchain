export const AllBloodUnits = (props) => {
    return (
        <div>
            <h4>All Blood Packet Hashes:</h4>
            <ul>
        {Object.keys(props.allBloodPacketHashes).map((contact, index) => (
          <li key={`${props.allBloodPacketHashes[index].name}-${index}`}>
            <h4>{props.allBloodPacketHashes[index]}</h4>
          </li>
        ))}
      </ul>
        </div>
    );
}