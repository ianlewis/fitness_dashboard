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

function getSleepData() {
  return new SleepData.SleepData(
    "https://docs.google.com/spreadsheets/d/1nv2WerPfSZK5TVRrVttscwJjGyUeQHbKIId5Wzz6wdA/edit",
    "https://docs.google.com/spreadsheets/d/1twQB4DUV0uj2U7dDnMnc65HqKPSN9ByMqdHIQrKn3-o/edit"
  );
}

function getMovementGraphData(rowId) {
  var sleepData = getSleepData();
  return [sleepData.getMovementData(rowId), sleepData.getEventData(rowId), sleepData.getSummary(rowId)];
}

function doGet(e) {
  var s = getSleepData();
  var template = HtmlService.createTemplateFromFile('MovementGraph');

  var rows = [];
  var data = s.getData();
  for (var i=0; i < data.length; i++) {
    if (data[i].Id) {
      rows.push(data[i]);
    }
  }
  template.rows = rows;
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
