const Menu = (props) => {
  return (
    <div className="ui secondary menu">
      <div className="item">
        <button className="ui compact button black">Show All</button>
      </div>
      <div className="item">
        <button className="ui compact button black">Make New</button>
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
