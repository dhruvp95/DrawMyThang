import { Spinner } from '@blueprintjs/core';
import React from 'react';
import socket from 'socket.io-client';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Header from './Header.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import Navibar from './Navibar.jsx';
import { app, base, githubProvider } from '../../env/base.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {
        displayName: '',
        photoURL: null,
        uid: '',
      },

      authenticated: false,
      loading: true,
      socket: socket('http://localhost:8080'),
    };
  }

  componentDidMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);

        const user_id = {
          displayName: user.displayName,
          photourl: user.photoURL,
          uid: user.uid,
        }
        if (!user.displayName) {
          user_id.displayName = user.uid;
        }
        console.log('user id ', user_id);
        this.setState({
          user: user_id,
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeAuthListener();
  }

  render() {
    if (this.state.loading === true) {
      return (
        <div style={{ textAlign: 'center', position: 'absolute', top: '25%', left: '50%' }}>
          <h3>Loading</h3>
          <Spinner /> 
        </div>
      );
    }

    return (
      <div id='firstDiv'>
        <BrowserRouter>
          <div>
            <Header authenticated={this.state.authenticated} />
            <div className="main-content"  >
              <div className="workspace" >
                <Route path="/login" render={() => <Login state={this.state} />} />
                <Route path="/logout" render={() => <Logout state={this.state} auth_user={this.state.user}/>} />
              </div>
            </div>
          </div>
        </BrowserRouter>
        <Navibar state={this.state} />
    </div>
    );
  }
}

export default App;