import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, browserHistory,IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './model/reducer';
import App from './app';
import Gathering from './views/gathering/gathering';
import Login from './views/login/login';
import Description from './views/description/description';
import PartyList from './views/partylist/partylist';

const store = DEBUG ? createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
) : createStore(rootReducer, applyMiddleware(thunkMiddleware));

const history = syncHistoryWithStore(browserHistory, store);
const checkLogin = (nextState, replace) => {
  const isLogin = window.sessionStorage.getItem('loginData');
  if (!isLogin) {
    replace({ pathname: '/login'});
  }
};
const StoreWrap = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to="/login" />
        <Route path="login" component={Login} />
        <Route path="register" component={Gathering} onEnter={checkLogin}/>
        <Route path="description" component={Description} onEnter={checkLogin}/>
        <Route path="partylist" component={PartyList} onEnter={checkLogin}/>
      </Route>
    </Router>
  </Provider>
);

export default StoreWrap;
