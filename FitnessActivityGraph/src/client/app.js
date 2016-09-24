/*
Copyright 2015 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import React from 'react';
import ReactDOM from 'react-dom';

import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Main from './Main'
import Authorize from './Authorize'
import SettingsForm from './SettingsForm'

var App = React.createClass({
  render: function() {
    return (
      <div>{this.props.children}</div>
    );
  }
});

const Settings = () => (
  <div>
    <AppBar
      title="Settings"
    />
    <SettingsForm />
  </div>
);

var NoMatch = React.createClass({
  componentDidMount: function() {
    browserHistory.push("/");
  },
  render: function() {
    return (
      <div>Could not find the requested page.</div>
    );
  }
});

ReactDOM.render(
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Main}/>
        <Route path="/settings" component={Settings}/>
        <Route path="/authorize" component={Authorize}/>
        <Route path="*" component={NoMatch}/>
      </Route>
    </Router>
  </MuiThemeProvider>,
  document.getElementById('main')
);
