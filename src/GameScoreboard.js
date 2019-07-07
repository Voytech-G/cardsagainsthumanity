import React from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import { connect } from 'react-redux';

import { getCookie } from './functions/cookies';
import { getRoomInfo } from './actions/index';

import pedalJS from './img/avatar.png';

const test = [
	{
		avatar: pedalJS,
		name: "Bartosz",
		points: 4,
		medals: "toDo",
		isWaiting: false,
	},
	{
		avatar: pedalJS,
		name: "czolgu!?",
		points: 2,
		medals: "toFokinDo",
		isWaiting: false,
	},
	{
		avatar: pedalJS,
		name: "VoidTech",
		points: 6.9,
		medals: "brak",
		isWaiting: true,
	}
];

const Player = ({avatar, name, points, medals, isWaiting}) =>
	<div className="player">
		<div className={isWaiting ? "avatar-waiting" : "avatar"}>
			<img src={avatar} alt="A" />
		</div>
		<div className={isWaiting ? "name-waiting" : "name"}>{name}</div>
		<div className="points">{points}</div>
		<div className="medals">{medals}</div>
		<div className="options">
			<i className="fas fa-ellipsis-v"></i>
		</div>
	</div>
;

class GameScoreboard extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		const { socket, getRoomInfo } = this.props;
		socket.on(`room-update`, data => {
      const { status, ...rest } = data;
      getRoomInfo(data.status ? rest : {});
    });
	}
	render() {
		const { roomInfo } = this.props;

		return (
			<div className="GameScoreboard">
				<div className="header">
					<div className="scoreboard">Scoreboard</div>
					<div className="points">
						<i className="fas fa-star"></i>
					</div>
					<div className="medals">
						<i className="fas fa-medal"></i>
					</div>
				</div>
				<div className="scoreboard">
					{roomInfo.connectedPlayers.map((p, i) => <Player key={i}
																avatar={pedalJS}
																name={p.username}
																points={p.points}
																medals="to do"
																isWaiting={Boolean(Math.floor(Math.random()*2))}>
					</Player>)}
				</div>
			</div>
		);
	}
}	

const mapStateToProps = state => {
	return {
		socket: state.socket,
		roomInfo: state.joinedRoomInfo,
	};
};
const mapDispatchToProps = dispatch => {
	return {
		getRoomInfo: response => dispatch(getRoomInfo(response)),
	};
};

GameScoreboard = connect(mapStateToProps, mapDispatchToProps)(GameScoreboard);

export default GameScoreboard;