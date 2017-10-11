import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import 'element-theme-default';
import { Button } from 'element-react';
import './css/main.scss'; // import global css style
import { GET } from './ultils/server';
import Tips from './components/tip/tips';

class App extends Component {
  constructor(props) {
    super(props);
    this.loginData = JSON.parse(window.sessionStorage.getItem('loginData'));
  }

  loginOut = () => {
    GET(`${url}/v1/user/logout`, this.loginData.token).then(res => {
      if (res.code === 200) {
        Tips.show(res.message);
        browserHistory.push('/login');
      }
    });
  };

  render() {
    return (
      <div>
        <div className="louka-header">
          <span>楼咖活动发布平台</span>
          <Button type="danger" onClick={this.loginOut} className="login-out">退出登录</Button>
        </div>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appState: state.appState,
  };
}

export default connect(mapStateToProps)(App);
