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

import React from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import { browserHistory } from 'react-router';

const style = {
  margin: 12,
};

var SettingsForm = React.createClass({
  getInitialState: function() {
    return {
      disabled: true,
      data: {}
    };
  },

  componentDidMount: function() {
    this.loadSettings();
  },

  loadSettings: function() {
    var self = this;

    self.setState({disabled: true});
    google.script.run.withSuccessHandler(function(settings) {
      self.setState({
        disabled: false,
        data: settings
      });
    }).withFailureHandler(function(msg) {
      alert(msg);
      browserHistory.push("/");
    }).getSettings();
  },

  handleSubmit: function() {
    var self = this;

    self.setState({disabled: true});
    google.script.run.withSuccessHandler(function(settings) {
      self.setState({disabled: false});

      browserHistory.push("/");
    }).withFailureHandler(function(msg) {
      alert(msg);
      self.setState({disabled: false});
    }).setSettings(this.state.data);
  },

  handleCancel: function() {
    browserHistory.push("/");
  },

  onClientIdChange: function(e) {
    var data = this.state.data;
    data.client_id = e.target.value;
    this.setState({data: data}); 
  },

  onClientSecretChange: function(e) {
    var data = this.state.data;
    data.client_secret = e.target.value;
    this.setState({data: data}); 
  },

  render: function() {
    return (
      <div>
        <TextField
          id="clientid"
          floatingLabelText="OAuth Client ID..."
          value={this.state.data.client_id || ""}
          disabled={this.state.disabled}
          style={style}
          onChange={this.onClientIdChange}
        /><br />

        <TextField
          id="clientsecret"
          floatingLabelText="OAuth Client Secret..."
          value={this.state.data.client_secret || ""}
          disabled={this.state.disabled}
          style={style}
          onChange={this.onClientSecretChange}
        /><br />

        <RaisedButton
          label="Submit"
          primary={true}
          onTouchTap={this.handleSubmit}
          style={style}
          disabled={this.state.disabled}
        />
        <RaisedButton
          label="Cancel"
          secondary={true}
          onTouchTap={this.handleCancel}
          style={style}
          disabled={this.state.disabled}
        />
      </div>
    );
  }
});

export default SettingsForm;
