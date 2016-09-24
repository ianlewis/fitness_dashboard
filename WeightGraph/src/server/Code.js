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

/**
 * A Google Apps Script that gets weight data from Google Fit and
 * display it on a graph. The doGet() method implements rendering the
 * graph html and the getWeightGraphData() method implements the call
 * to get the graph data.
 */

/**
 * Gets the user properties containing the OAuth client info.
 */
function getSettings() {
  var props = PropertiesService.getUserProperties();

  return {
    client_id: props.getProperty('CLIENT_ID'),
    client_secret: props.getProperty('CLIENT_SECRET')
  }
}

/**
 * Sets the user properties containing the OAuth client info.
 */
function setSettings(obj) {
  var props = PropertiesService.getUserProperties();
  props.setProperty("CLIENT_ID", obj.client_id);
  props.setProperty("CLIENT_SECRET", obj.client_secret);
}

/**
 * Gets the Google Fit service object that can be used to fetch data from the
 * Google Fit API. This function uses the OAuth2 Apps Script library.
 * See: https://github.com/googlesamples/apps-script-oauth2
 */
function getFitnessService_() {
  var settings = getSettings();

  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('fitness')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(settings.client_id)
      .setClientSecret(settings.client_secret)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      .setScope('https://www.googleapis.com/auth/fitness.body.read')

      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      .setParam('login_hint', Session.getActiveUser().getEmail())

      // Requests offline access.
      .setParam('access_type', 'offline')

      // Forces the approval prompt every time. This is useful for testing,
      // but not desirable in a production application.
      .setParam('approval_prompt', 'force');
}

/**
 * Makes a raw request to the Google Fit API and parses the response
 * JSON.
 */
function getWeight_(startTime, endTime) {
  var service = getFitnessService_();
  var uri = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.weight:com.google.android.gms:merge_weight/datasets/' + (startTime.getTime() * 1000000) + '-' + (endTime.getTime() * 1000000);
  return JSON.parse(UrlFetchApp.fetch(uri, {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken()
    }
  }));
}

/**
 * Gets the data for the Weight Graph given start and end times (UTC unix
 * timestamps).
 */

function getWeightGraphData(startTime, endTime) {
  var weights = getWeight_(new Date(startTime), new Date(endTime));
  
  var weightData = [];

  for (var i=0; i < weights.point.length; i++) {
    var weight = weights.point[i].value[0].fpVal;
    var millis = weights.point[i].startTimeNanos / 1000000;
    weightData.push([millis, weight]);
  }
  
  return weightData;
}

/**
 * Implements the callback for the OAuth authorization flow.
 */
function authCallback(request) {
  var service = getFitnessService_();
  var isAuthorized = service.handleCallback(request);
  return index_();
}

function getAppStatus() {
  var settings = getSettings();
  if (!settings.client_id || !settings.client_secret) {
    return {
      isSetup: false,
      hasAccess: false
    };
  }

  var service = getFitnessService_();
  return {
    isSetup: true,
    hasAccess: service.hasAccess()
  };
}

function getAuthorizationUrl() {
  var service = getFitnessService_();
  return service.getAuthorizationUrl();
}

/**
 * Unlink from the Google Fit API.
 */
function unlink() {
  var service = getFitnessService_();
  service.reset();
  return true;
}


/**
 * Show the index page with the weight graph.
 */
function index_() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME); 
}

/**
 * Handle a GET request to the application.
 */
function doGet(e) {
  return index_();
}
