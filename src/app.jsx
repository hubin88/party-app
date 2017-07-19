import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'element-theme-default';
import './css/main.scss'; // import global css style

class App extends Component {
  render() {
    return (
      <div>
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
