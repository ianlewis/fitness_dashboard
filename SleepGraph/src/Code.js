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

function getSleepDataGraphData() {
  var s = new SleepData.SleepData(
    "https://docs.google.com/spreadsheets/d/1nv2WerPfSZK5TVRrVttscwJjGyUeQHbKIId5Wzz6wdA/edit",
    "https://docs.google.com/spreadsheets/d/1twQB4DUV0uj2U7dDnMnc65HqKPSN9ByMqdHIQrKn3-o/edit"
  );
  s.loadData();
  var grouped = s.getGroupedData();

  var hoursData = [], deepSleepData = [];
  
  for (var i=0; i<grouped.length; i++) {
    var date = Date.UTC(
      grouped[i].From.getFullYear(),
      grouped[i].From.getMonth(),
      grouped[i].From.getDate()
    );
    
    hoursData.push([
      date,
      grouped[i].Hours
    ]);
    if (grouped[i].DeepSleep >= 0) {
      deepSleepData.push([
        date,
        grouped[i].DeepSleep * grouped[i].Hours
      ]);
    }
  }

  return {
    hours: hoursData,
    deepSleep: deepSleepData
  };
}

function doGet(e) {
   return HtmlService.createHtmlOutputFromFile('SleepGraph')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
