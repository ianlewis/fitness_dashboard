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

import React from 'react';

import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

const style = {
  margin: 12,
};

var Authorize = React.createClass({
  getInitialState: function() {
    return {
      disabled: true,
      authorizationUrl: ""
    };
  },

  gotoSettings: function() {
    browserHistory.push("/settings");
  },

  componentWillMount: function() {
    var self = this;

    google.script.run.withSuccessHandler(function(appStatus) {
      if (!appStatus.isSetup) {
        self.gotoSettings();
        return
      }

      self.setState({ready: true});
    }).withFailureHandler(function(msg) {
      alert(msg);
      location.reload();
    }).getAppStatus();
  },

  componentDidMount: function() {
    var self = this;

    google.script.run.withSuccessHandler(function(url) {
      self.setState({
        disabled: false,
        authorizationUrl: url
      });
    }).withFailureHandler(function(msg) {
      alert(msg);
      location.reload();
    }).getAuthorizationUrl();
  },

  handleSubmit: function() {
    window.top.location.href = this.state.authorizationUrl;
  },

  render: function() {
    if (this.state.ready) {
      return (
        <div>
          <AppBar
            title="Authorize"
            iconElementRight={
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem
                  primaryText="Settings"
                  onTouchTap={this.gotoSettings}
                />
              </IconMenu>
            }
          />
          <RaisedButton
            label="Connect with Google Fit"
            primary={true}
            onTouchTap={this.handleSubmit}
            style={style}
            disabled={this.state.disabled}
          />
        </div>
      );
    } else {
      return (
        <LinearProgress mode="indeterminate" />
      )
    }
  }
});

export default Authorize;
