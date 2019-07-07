import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import Dashboard from './Dashboard';
import GameRoom from './GameRoom';
import NotificationList from './NotificationList';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/game" component={GameRoom} />
        </Switch>
        <NotificationList maxNotifications={4}/>
      </div>
    );
  }
}

export default App;