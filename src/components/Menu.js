const Menu = (props) => {
  return (
    <div className="ui secondary menu">
      <div className="item">
        <button
          className="ui button compact black"
          onClick={() => props.mainContentChange("allBloodUnits")}
        >
          Show All
        </button>
      </div>
      <div className="item">
        <button
          className="ui compact button black"
          onClick={() => props.mainContentChange("phlebotomistForm")}
        >
          Make New
        </button>
      </div>
      <div className="right menu">
        <div className="item">
          {!props.accountDetails.isLogged && (
            <button className="ui positive button">Connect Metamask</button>
          )}
          {props.accountDetails.isLogged && (
            <button className="ui positive button">Disconnect Metamask</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
