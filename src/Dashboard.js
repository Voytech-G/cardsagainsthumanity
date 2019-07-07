import React from 'react';
import Navbar from './Navbar';
import Modal from './Modal';
import Room from './Room';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getCookie } from './functions/cookies';
import { getUsername, getRoomsList, getRoomId, addNotification } from './actions/index';
import deckSvg from './img/deck.svg';

const ROOM_NAME_MIN_LENGTH = 4;
const ROOM_MAX_PLAYERS_MIN = 3;
const ROOM_POINTS_MIN = 5;

const checkIfValid = (roomName, roomMaxPlayers, roomPoints) => roomName.length >= ROOM_NAME_MIN_LENGTH && +roomMaxPlayers >= ROOM_MAX_PLAYERS_MIN && +roomPoints >= ROOM_POINTS_MIN;

const Tab = (props) =>
  <div className={`tab-${props.active ? "active" : "inactive"}`} {...props}>{props.children}</div>
;

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectTo: "",
      activeTab: 0,
      searchText: "",
      modalShow: null,
      // Modals - create-room

      roomNameText: "",
      roomPasswordText: "",
      roomMaxPlayersText: "10",
      roomPointsText: "15",
    };
  }

  componentDidMount() {
    const { socket, getRoomsList, getUsername } = this.props;
    socket.emit("check-session", getCookie("sid"), response => {
      getUsername(response.status ? response.uname : this.setState({ redirectTo: "/" }));
      this.setState({ redirectTo: response.status && response.roomId.length > 0 ? `/game/${response.roomId}` : "" });
    });
    socket.emit("get-roomslist", null, rooms => getRoomsList(rooms));
    socket.on("rooms-list", rooms => getRoomsList(rooms));
  }

  handleClickCreateRoom() {
    const { socket } = this.props;
    const { roomNameText, roomPasswordText, roomMaxPlayersText, roomPointsText } = this.state;

    if (checkIfValid(roomNameText, roomMaxPlayersText, roomPointsText)) { 
      socket.emit("create-room", {
        sessionId  : getCookie('sid'),
        roomName: roomNameText,
        roomPassword: roomPasswordText,
        roomMaxPlayers: roomMaxPlayersText,
        roomPoints: roomPointsText
      }, (response)=>{
        if (response.status){
          console.log(response.mess);
          this.setState({ roomId: response.roomId, redirectTo: `/game/${response.roomId}` });
        } else {
          console.log(response.err);
        }
      });
    }
  }

  handleInputSearch(evt) {
    const { value } = evt.target;
    evt.preventDefault();

    this.setState({ searchText: value });
  }

  render() {
    const { rooms } = this.props;
    const { redirectTo, activeTab, searchText, roomNameText, roomPasswordText, roomMaxPlayersText, roomPointsText } = this.state;
    const validForm = checkIfValid(roomNameText, roomMaxPlayersText, roomPointsText);

    return (
      <div className='Dashboard'>
        {redirectTo.length > 0 ? <Redirect to={redirectTo}/> : ""}
        <Navbar logoutTo="/" />
        <Modal show={this.state.modalShow === "create-room"} title="pedał.js" onHide={() => this.setState({ modalShow: null })}>
          <div className="input-with-label">
            <span className="label">Room name:</span>
            <input type="text" placeholder="Min. 4 characters length" onChange={(evt) => this.setState({ roomNameText: evt.target.value })}       value={roomNameText}/>
          </div>
          <div className="input-with-label">
            <span className="label">Room password:</span>
            <input type="text" placeholder="(optional)"               onChange={(evt) => this.setState({ roomPasswordText: evt.target.value })}   value={roomPasswordText}/>
          </div>
          <div className="input-with-label">
            <span className="label">Max players:</span>
            <input type="text" placeholder="> 2"                      onChange={(evt) => this.setState({ roomMaxPlayersText: evt.target.value })} value={roomMaxPlayersText}/>
          </div>
          <div className="input-with-label">
            <span className="label">Points to win:</span>
            <input type="text" placeholder=">= 5"                      onChange={(evt) => this.setState({ roomPointsText: evt.target.value })} value={roomPointsText}/>
          </div>
          <button className="create-room" disabled={!validForm} onClick={this.handleClickCreateRoom.bind(this)} >Create</button>
        </Modal>

        <div className="tabs">
          <Tab active={+(activeTab === 0)} onClick={() => this.setState({ activeTab: 0 })}>Game rooms</Tab>
          <Tab active={+(activeTab === 1)} onClick={() => this.setState({ activeTab: 1 })}>Card decks</Tab>
        </div>

        {activeTab === 0 ?
        <>
          <div className="game-rooms">
            <div className="row-1">
              <div className="search-text">
                <span className="found-rooms">
                  Found <span className="how-many">{rooms.filter(room => room.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1).length}</span> room{rooms.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex-wrapper buttons">
                <button className="refresh">
                  Refresh
                </button>
                <button className="create-room" onClick={() => this.setState({ modalShow: "create-room" })}>
                  Create room
                </button>
              </div>
            </div>
            <div className="row-2">
              <input type="input" className="search-input" placeholder="Search game..." value={searchText} onChange={this.handleInputSearch.bind(this)} />
            </div>
          </div>
          
          <div className="room-list">
            <div className="header">
              <div className="empty"></div>
              <div className="game-name">
                <i className="fas fa-clipboard"></i> GAME NAME
              </div>
              <div className="players">
                <i className="fas fa-users"></i> PLAYERS
              </div>
              <div className="decks-used">
                <img src={deckSvg} width={13} height={12} alt="Cards"/> DECKS USED
              </div>
              <div className="score-to-win">
                <i className="fas fa-star"></i> SCORE TO WIN
              </div>
            </div>
            {rooms
              .filter(room => room.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
              .map(room => <Room  key={room.id}
                                  id={room.id}
                                  name={room.name}
                                  password={room.password.length > 0}
                                  owner={room.owner}
                                  connectedPlayers={room.connectedPlayers}
                                  maxPlayers={room.maxPlayers}
                                  decks={room.decks}
                                  pointsToWin={room.pointsToWin}
                                  language={room.language}/>)}
          </div>
        </>
        :
        ""
        }
      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    socket: state.socket,
    loggedIn: state.loggedIn,
    username: state.username,
    rooms: state.rooms,
    joinedRoomId: state.joinedRoomId,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addNotification: response => dispatch(addNotification(response)),
    getUsername: response => dispatch(getUsername(response)),
    getRoomsList: response => dispatch(getRoomsList(response)),
    getRoomId: response => dispatch(getRoomId(response)),
  };
};

Dashboard = connect(mapStateToProps, mapDispatchToProps)(Dashboard);

export default Dashboard;