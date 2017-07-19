import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './model/reducer';
import App from './app';
import Party from './views/party';
import Details from './views/details/details';

const store = DEBUG ? createStore(
  rootReducer,
  compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
) : createStore(rootReducer, applyMiddleware(thunkMiddleware));

const history = syncHistoryWithStore(browserHistory, store);

const StoreWrap = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="party" component={Party} />
        <Route path="party/detail/:partyId/user/:userId" component={Details} />
      </Route>
    </Router>
  </Provider>
);

export default StoreWrap;
