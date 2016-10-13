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
* Creates a new SleepData object that contains all sleep data.
*
* @param {sheet_url} A url to the Sleep as Android backup spreadsheet
*/
function SleepData(sheet_url) {
  this._loaded = false;
  this.data = [];
  this.grouped = [];
  this.SHEET_URL = sheet_url;
  
  this.rawDataValues = [];
}

SleepData.prototype.COLS = [
    "Id",
    "Tz",
    "From",
    "To",
    "Sched",
    "Hours",
    "Rating",
    "Comment",
    "Framerate",
    "Snore",
    "Noise",
    "Cycles",
    "DeepSleep",
    "LenAdjust",
    "Geo"
];

/**
* Loads the data into the data object.
*/
SleepData.prototype.loadData = function() {
  if (!this._loaded) {
    var newData = [];
    var grouped_obj = {};
    
    // Load data from the Sleep as Android backup file.
    var sheet = SpreadsheetApp.openByUrl(this.SHEET_URL).getActiveSheet();
    this.rawDataValues = sheet.getDataRange().getValues();
    
    // The actual data is not contained in every row so we need to skip rows here.
    for (var i = 1; i < this.rawDataValues.length; i++) {
      // Skip the row if it's not a data row.
      // Note: 0 is not a valid Id so we don't care about that case.
      if (!parseInt(this.rawDataValues[i][this.COLS.indexOf("Id")])) {
        continue;
      }
      
      var row = {};
      for (var j = 0; j < this.COLS.length; j++) {
        row[this.COLS[j]] = this.rawDataValues[i][j];
      }
      normalize_(row);
      
      addToGroup_(grouped_obj, row);
      newData.push(row);
    }
    this.data = newData;
    this.grouped = getSortedList_(grouped_obj);
    
    this._loaded = true;
  }
};

SleepData.prototype.getMovementData = function(rowId) {
  this.loadData();
  
  // The actual data is not contained in every row so we need to skip rows here.
  for (var i = 1; i < this.rawDataValues.length; i++) {
    // Skip the row if it's not a data row.
    // Note: 0 is not a valid Id so we don't care about that case.
    var thisRowId = this.rawDataValues[i][this.COLS.indexOf("Id")];
    
    if (!parseInt(thisRowId)) {
      continue;
    }
    
    if (thisRowId === rowId) {
      var movementData = [];
      
      var j = 15;
      var addToDate = 0; // We need to know if the date has carried over.
      var From = parseDate_(this.rawDataValues[i][this.COLS.indexOf("From")]);
      var tz = this.rawDataValues[i][this.COLS.indexOf("Tz")];
      var prevHours = From.getHours();
      while (j < this.rawDataValues[i].length && Number(this.rawDataValues[i][j]) === this.rawDataValues[i][j]) {
        var year = From.getFullYear();
        var month = From.getMonth();
        var date = From.getDate();
        var hours = this.rawDataValues[i-1][j].getHours();
        var minutes = this.rawDataValues[i-1][j].getMinutes();
        
        if (hours < prevHours) {
          addToDate++; // If the hours have carried over, increase the date.
        }

        movementData.push([{
          year: year,
          month: month,
          day: date,
          hours: hours,
          minutes: minutes
        }, this.rawDataValues[i][j]]);
        
        j++;
        prevHours = hours;
      }

      // movementData should already be sorted.
      return [tz, movementData];
    }
  }
};

SleepData.prototype.getEventData = function(rowId) {
  this.loadData();
  
  // The actual data is not contained in every row so we need to skip rows here.
  for (var i = 1; i < this.rawDataValues.length; i++) {
    // Skip the row if it's not a data row.
    // Note: 0 is not a valid Id so we don't care about that case.
    var thisRowId = this.rawDataValues[i][this.COLS.indexOf("Id")];
    
    if (!parseInt(thisRowId)) {
      continue;
    }
    
    if (thisRowId === rowId) {
      var eventData = [];
      
      var j = 15;
      // Skip values before the event data.
      while (j < this.rawDataValues[i].length && Number(this.rawDataValues[i][j]) === this.rawDataValues[i][j]) {
        j++;
      }
      
      // Continue parsing the event data
      while (j < this.rawDataValues[i].length && this.rawDataValues[i-1][j] === 'Event') {
        var eventVal = this.rawDataValues[i][j].split("-");
        eventData.push({
          name: eventVal[0],
          timestamp: parseInt(eventVal[1], 10)
        });
        j++;
      }
      return eventData.sort(function(a, b) {
        return a.timestamp - b.timestamp;
      });
    }
  }
};


SleepData.prototype.getSummary = function(rowId) {
  this.loadData();

  // The actual data is not contained in every row so we need to skip rows here.
  for (var i = 0; i < this.data.length; i++) {
    // Note: 0 is not a valid Id so we don't care about that case.
    var thisRowId = parseInt(this.data[i].Id);
    
    if (!thisRowId) {
      continue;
    }
    
    if (thisRowId === rowId) {
      var row = this.data[i];
      return {
        Hours: row.Hours,
        DeepSleep: row.DeepSleep,
        DeepSleepHours: row.Hours * row.DeepSleep,
        Cycles: row.Cycles
      }
    }
  }
};

/**
* Gets the raw sleep data.
*
* @param {fromDate} the start date for the data
* @param {toDate} end end date for the data
*/
SleepData.prototype.getData = function(fromDate, toDate) {
  this.loadData();
  
  var from, data = [];
  for (var i = 0; i < this.data.length; i++) {
    if ((fromDate == null || this.data[i].From >= fromDate) && (toDate == null || this.data[i].From < toDate)) {
      data.push(this.data[i]);
    }
  }
  return data;
};

/**
* Gets data grouped by date. This allows you to get a summary
* of the amount of time you slept per day.
*
* @param {fromDate} the start date for the data
* @param {toDate} end end date for the data
*/
SleepData.prototype.getGroupedData = function(fromDate, toDate) {
  this.loadData();
  
  var from, data = [];
  for (var i = 0; i < this.grouped.length; i++) {
    if ((fromDate == null || this.grouped[i].From >= fromDate) && (toDate == null || this.grouped[i].From < toDate)) {
      data.push(this.grouped[i]);
    }
  }
  return data;
};

/**
 * Groups sleep data by date. Effectively giving you
 * how much you slept each day.
 */
function addToGroup_(group_obj, row) {
  var year = row.To.getFullYear();
  var month = row.To.getMonth();
  var day = row.To.getDate();
  if (!(year in group_obj)) {
      group_obj[year] = {};
  }
  if (!(month in group_obj[year])) {
    group_obj[year][month] = {};
  }
  if (!(day in group_obj[year][month])) {
    group_obj[year][month][day] = {
      Hours: 0,
      DeepSleep: -1,
    };
  }
  
  if (row.DeepSleep >= 0) {
    if (group_obj[year][month][day].DeepSleep >= 0) {
      group_obj[year][month][day].DeepSleep = (group_obj[year][month][day].Hours * group_obj[year][month][day].DeepSleep + row.Hours * row.DeepSleep) / (group_obj[year][month][day].Hours + row.Hours);
    } else {
      group_obj[year][month][day].DeepSleep = row.DeepSleep
    }
  }
  group_obj[year][month][day].Hours += row.Hours;
}

function getSortedList_(grouped_obj) {
  var unsorted = [];
  for (var year in grouped_obj) {
    for (var month in grouped_obj[year]) {
      for (var day in grouped_obj[year][month]) {
        unsorted.push({
          From: new Date(year, month, day),
          Hours: grouped_obj[year][month][day].Hours,
          DeepSleep: grouped_obj[year][month][day].DeepSleep,
        });
      }
    }
  }
  
  return unsorted.sort(function(a, b) {
    return a.From.getTime() - b.From.getTime();
  });
}

function normalize_(row) {
  row.From = parseDate_(row.From);
  row.To = parseDate_(row.To);
  row.Sched = parseDate_(row.Sched);
  row._TotalHours = row.Hours;
  row.Hours = row.Hours + (row.LenAdjust / 60);
}

/*
 * Dates seem to be in two different formats.
 * Decide which format it is and parse the string into a
 * Date object.
 */
function parseDate_(dateStr) {
  if (dateStr instanceof Date) {
    // NOTE: Dates are D/M/YYYY so the date was probably
    //       Parsed incorrectly by Google Spreadsheets
    if (dateStr.getDate() <= 12) {
      return new Date(
        dateStr.getFullYear(),
        dateStr.getDate() - 1,
        dateStr.getMonth() + 1,
        dateStr.getHours(),
        dateStr.getMinutes()
      );
    } else {
      return dateStr;
    }
  }
  
  if (dateStr.indexOf("/") > 0) {
    return parseNewDate_(dateStr);
  } else {
    return parseOldDate_(dateStr);
  }
}

/*
* New dates are of the form D/M/YYYY HH:MM:SS
 * Leading zeros are not included.
 */
function parseNewDate_(dateStr, tz) {
  var datetime = dateStr.split(" ");
  var date = datetime[0];
  var time = datetime[1];

  var dateVals = date.split("/");
  var timeVals = time.split(":");

  return new Date(
    dateVals[2],
    dateVals[1] - 1,
    dateVals[0],
    timeVals[0],
    timeVals[1]
  );
}

/*
 * Old dates are of the form DD. MM. YYYY HH:MM
 * Values have leading zeros.
 */
function parseOldDate_(dateStr, tz) {
  var dateVals = dateStr.split(" ");
  var time = dateVals[3];
  var timeVals = time.split(":");

  return new Date(
    dateVals[2],
    dateVals[1].slice(0, 2) - 1,
    dateVals[0].slice(0, 2),
    timeVals[0],
    timeVals[1]
  );
}

function test() {
  var s = new SleepData(
    "https://docs.google.com/spreadsheets/d/1nv2WerPfSZK5TVRrVttscwJjGyUeQHbKIId5Wzz6wdA/edit"
  );
  Logger.log(s.getMovementData(1445609660878));
}
