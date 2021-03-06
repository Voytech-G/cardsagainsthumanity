import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { setCookie, getCookie } from './functions/cookies';
import { getUsername } from './actions/index';

import fuckMeInTheAss from './img/avatar.png'; //naj

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: ""
    };
  }
  handleClickLogout() {
    const { socket, logoutTo } = this.props;

    socket.emit("logout", {
      sessionId: getCookie("sid")
    }, (response) => {
      if (response.status){
        setCookie("sid", "", -1);
        console.log(response.mess);
      } else {
        console.log(response.err);
      }
    });
    this.setState({ redirectTo: logoutTo });
  }
  render() {
    const { username } = this.props;
    const { redirectTo } = this.state;

    return (
      <nav>
        {redirectTo.length > 0 ? <Redirect to={redirectTo} /> : ""}
        <div className="logo">
          <span className="cards">Cards </span>
          <span className="against">Against </span>
          <span className="humanity">Humanity</span>
        </div>
        <div className="logo-mini">
          <span className="cards">C</span>
          <span className="against">A</span>
          <span className="humanity">H</span>
        </div>
        <div className="flex-wrapper">
          <div className="user">
            <div className="avatar">
              <img src={fuckMeInTheAss} alt="A"/>
            </div>
            <span className="welcome-message">
              Welcome, <span className="username">{username}!</span>
            </span>
          </div>
          <div className="logout" onClick={this.handleClickLogout.bind(this)}>
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    socket: state.socket,
    username: state.username,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUsername: response => dispatch(getUsername(response)),
  };
};

Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default Navbar;