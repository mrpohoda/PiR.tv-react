import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router';

import HomeHandler from './components/home.js';
// import LoginHandler from './components/login.js';
var LoginHandler = HomeHandler;

let App = React.createClass({
  render() {
    return (
      <div>
        {
        /*
        <div className="nav">
          <Link to="app">Home</Link>
          <Link to="login">Login</Link>

        </div>
        */
        }
        {/* this is the importTant part */}
        <RouteHandler/>
      </div>
    );
  }
});

let routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={HomeHandler} />
    <Route name="login" path="/login" handler={LoginHandler}/>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.querySelector('#app'));
});