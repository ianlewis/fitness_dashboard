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

// A map of activity type names to activity code.
// See: https://developers.google.com/fit/rest/v1/reference/activity-types
var ACTIVITY_TYPE = {
  // IN_VEHICLE:                                   0,
  BIKING:                                       1,
  ON_FOOT:                                      2,
  // "STILL (NOT MOVING)":                         3,
  "UNKNOWN (UNABLE TO DETECT ACTIVITY)":        4,
  "TILTING (SUDDEN DEVICE GRAVITY CHANGE)":     5,
  WALKING:                                      7,
  RUNNING:                                      8,
  AEROBICS:                                     9,
  BADMINTON:                                    10,
  BASEBALL:                                     11,
  BASKETBALL:                                   12,
  BIATHLON:                                     13,
  HANDBIKING:                                   14,
  MOUNTAIN_BIKING:                              15,
  ROAD_BIKING:                                  16,
  SPINNING:                                     17,
  STATIONARY_BIKING:                            18,
  UTILITY_BIKING:                               19,
  BOXING:                                       20,
  CALISTHENICS:                                 21,
  CIRCUIT_TRAINING:                             22,
  CRICKET:                                      23,
  CURLING:                                      106,
  DANCING:                                      24,
  DIVING:                                       102,
  ELLIPTICAL:                                   25,
  ERGOMETER:                                    103,
  FENCING:                                      26,
  "FOOTBALL (AMERICAN)":                        27,
  "FOOTBALL (AUSTRALIAN)":                      28,
  "FOOTBALL (SOCCER)":                          29,
  FRISBEE:                                      30,
  GARDENING:                                    31,
  GOLF:                                         32,
  GYMNASTICS:                                   33,
  HANDBALL:                                     34,
  HIKING:                                       35,
  HOCKEY:                                       36,
  HORSEBACK_RIDING:                             37,
  HOUSEWORK:                                    38,
  ICE_SKATING:                                  104,
  JUMPING_ROPE:                                 39,
  KAYAKING:                                     40,
  KETTLEBELL_TRAINING:                          41,
  KICKBOXING:                                   42,
  KITESURFING:                                  43,
  MARTIAL_ARTS:                                 44,
  // MEDITATION:                                   45,
  MIXED_MARTIAL_ARTS:                           46,
  P90X_EXERCISES:                               47,
  PARAGLIDING:                                  48,
  PILATES:                                      49,
  POLO:                                         50,
  RACQUETBALL:                                  51,
  ROCK_CLIMBING:                                52,
  ROWING:                                       53,
  ROWING_MACHINE:                               54,
  RUGBY:                                        55,
  JOGGING:                                      56,
  RUNNING_ON_SAND:                              57,
  "RUNNING (TREADMILL)":                        58,
  SAILING:                                      59,
  SCUBA_DIVING:                                 60,
  SKATEBOARDING:                                61,
  SKATING:                                      62,
  CROSS_SKATING:                                63,
  INDOOR_SKATING:                               105,
  "INLINE_SKATING (ROLLERBLADING)":             64,
  SKIING:                                       65,
  "BACK-COUNTRY SKIING":                        66,
  "CROSS-COUNTRY SKIING":                       67,
  DOWNHILL_SKIING:                              68,
  KITE_SKIING:                                  69,
  ROLLER_SKIING:                                70,
  SLEDDING:                                     71,
  // SLEEPING:                                     72,
  // LIGHT_SLEEP:                                  109,
  // DEEP_SLEEP:                                   110,
  // REM_SLEEP:                                    111,
  // "AWAKE (DURING SLEEP CYCLE)":                 112,
  SNOWBOARDING:                                 73,
  SNOWMOBILE:                                   74,
  SNOWSHOEING:                                  75,
  SQUASH:                                       76,
  STAIR_CLIMBING:                               77,
  "STAIR-CLIMBING MACHINE":                     78,
  "STAND-UP PADDLEBOARDING":                    79,
  STRENGTH_TRAINING:                            80,
  SURFING:                                      81,
  SWIMMING:                                     82,
  "SWIMMING (OPEN WATER)":                      84,
  "SWIMMING (SWIMMING POOL)":                   83,
  "TABLE TENNIS (PING PONG)":                   85,
  TEAM_SPORTS:                                  86,
  TENNIS:                                       87,
  "TREADMILL (WALKING OR RUNNING)":             88,
  VOLLEYBALL:                                   89,
  "VOLLEYBALL (BEACH)":                         90,
  "VOLLEYBALL (INDOOR)":                        91,
  WAKEBOARDING:                                 92,
  "WALKING (FITNESS)":                          93,
  NORDING_WALKING:                              94,
  "WALKING (TREADMILL)":                        95,
  WATERPOLO:                                    96,
  WEIGHTLIFTING:                                97,
  WHEELCHAIR:                                   98,
  WINDSURFING:                                  99,
  YOGA:                                         100,
  ZUMBA:                                        101,

  "OTHER (UNCLASSIFIED FITNESS ACTIVITY)":      108
};

// Create a reverse map of activity codes to name.
ACTIVITY_MAP = {};
for (var key in ACTIVITY_TYPE) {
  if (ACTIVITY_TYPE.hasOwnProperty(key)) {
    ACTIVITY_MAP[ACTIVITY_TYPE[key]] = key;
  }
}

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


// Using: https://github.com/googlesamples/apps-script-oauth2
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
      .setScope('https://www.googleapis.com/auth/fitness.activity.read')

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
 * Groups activity data by date.
 */
function addToGroup_(group_obj, fromDate, activity, deltaNanos) {
  if (ACTIVITY_MAP[activity]) {
    var year = fromDate.getFullYear();
    var month = fromDate.getMonth();
    var day = fromDate.getDate();
    if (!(year in group_obj)) {
      group_obj[year] = {};
    }
    if (!(month in group_obj[year])) {
      group_obj[year][month] = {};
    }
    if (!(day in group_obj[year][month])) {
      group_obj[year][month][day] = {};
    }
    if (!(ACTIVITY_MAP[activity] in group_obj[year][month][day])) {
      group_obj[year][month][day][ACTIVITY_MAP[activity]] = 0;
    }
  
    group_obj[year][month][day][ACTIVITY_MAP[activity]] += (deltaNanos / 1000000.0 / 1000.0 / 60.0);
    if (group_obj.ACTIVITIES.indexOf(activity) === -1) {
      group_obj.ACTIVITIES.push(activity);
    }
  }
}

function getSortedLists_(grouped_obj, dayAvg) {
  var sortedLists = {}, avgData = [], avgItems = [];

  Logger.log(grouped_obj);

  // Set up the sortedLists of data for each activity.
  for (var i = 0; i < grouped_obj.ACTIVITIES.length; i++) {
    sortedLists[ACTIVITY_MAP[grouped_obj.ACTIVITIES[i]]] = [];
  }

  // We grouped data by date so that we could loop by date here
  // and calculate the average. But for the output format we
  // want to group the data by activity so we'll actually group
  // it by activity here, as well as sort it and calculate the average.
  for (var year in grouped_obj) {
    for (var month in grouped_obj[year]) {
      for (var day in grouped_obj[year][month]) {
        var millis = Date.UTC(year, month, day);

        // Calculate the total active time.
        var total = 0;
        for (key in grouped_obj[year][month][day]) {
          if (grouped_obj[year][month][day].hasOwnProperty(key)) {
            total += grouped_obj[year][month][day][key];
          }
        }
        

        // Add the active time for each activity type
        for (var key in sortedLists) {
          if (sortedLists.hasOwnProperty(key)) {
            // Add the active time for each activity type
            if (key in grouped_obj[year][month][day]) {
              sortedLists[key].push([millis, grouped_obj[year][month][day][key]]);
            } else {
              sortedLists[key].push([millis, 0]);
            }
          }
        }

        // Add the total values to a list so that we can calculate rolling averages.
        avgItems.push(total);
        // Remove items from the list that have rolled out of the window for the rolling average.
        while (avgItems.length > dayAvg) {
          avgItems.shift();
        }
        
        // Calculate the rolling average.
        var avg = 0;
        for (var j=0; j<avgItems.length; j++) {
          avg += avgItems[j];
        }
        avg = avg / avgItems.length;
        avgData.push([millis, avg]);
      }
    }
  }


  for (var key in sortedLists) {
    if (sortedLists.hasOwnProperty(key)) {
      sortedLists[key] = sortedLists[key].sort(function(a, b) {
        return a[0] - b[0];
      });
    }
  }

  avgData = avgData.sort(function(a, b) {
    return a[0] - b[0];
  });
  
  return {
    data: sortedLists,
    avg: avgData
  }
}

function getActivity_(startTime, endTime) {
  var service = getFitnessService_();
  var uri = 'https://www.googleapis.com/fitness/v1/users/me/dataSources/derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments/datasets/' + (startTime.getTime() * 1000000) + '-' + (endTime.getTime() * 1000000);
  return JSON.parse(UrlFetchApp.fetch(uri, {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken()
    }
  }));
}

function getActivityGraphData(startTime, endTime, dayAvg) {
  dayAvg = dayAvg | 14;
  var activity = getActivity_(new Date(startTime), new Date(endTime));
  
  var group_obj = {ACTIVITIES: []};
  
  for (var i=0; i < activity.point.length; i++) {
    var segment = activity.point[i];
    addToGroup_(
      group_obj,
      new Date(segment.startTimeNanos / 1000000.0),
      segment.value[0].intVal,
      segment.endTimeNanos - segment.startTimeNanos
    );
  }
  
  return getSortedLists_(group_obj, dayAvg);
}

/**
 * Implements the callback for the OAuth authorization flow.
 */
function authCallback(request) {
  var service = getFitnessService_();
  var isAuthorized = service.handleCallback(request);
  return index_();
}

/**
 * Returns the current application status. This includes
 * Whether the application has been setup and is authorized.
 */
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
}

function index_() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME); 
}

function doGet(e) {
  return index_();
}
