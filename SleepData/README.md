# SleepData

SleepData is a library for reading sleep data from an [Sleep as
Android](https://play.google.com/store/apps/details?id=com.urbandroid.sleep)
backup spreadsheet file and a
[SleepBot](https://play.google.com/store/apps/details?id=com.lslk.sleepbot) CSV
export file. *SleepBot support is included mostly because I wanted to include
my old sleep data before I switched to using Sleep for Android.*

```
var s = new SleepData(SleepAsAndroidSheetURL, SleepBotSheetURL);

// Get all data rows.
var d = s.getData(fromDate, toDate);

// Get data grouped by day.
var g = s.getGroupedData(fromDate, toDate);
```
## Setup

### Requirements

1. node
1. npm
1. gulp

### Install dependencies

Run npm:

```console
$ npm install
```

### Authentication

TODO

```console
$ ./node_modules/.bin/gapps init --subdir dist
```

### Initialization

TODO

```console
$ ./node_modules/.bin/gapps init <fileid>
```

## Build

Build the app using gulp. This will combine all the javascript
files into a single, compact Code.js in the dist directory.

```console
$ gulp
```

## Upload

You can use the upload task to upload the code to Google Drive.

```console
$ gulp upload
```
