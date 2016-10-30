# SleepData

SleepData is a library for reading sleep data from an [Sleep as
Android](https://play.google.com/store/apps/details?id=com.urbandroid.sleep)
backup spreadsheet file.

```
var s = new SleepData(SleepAsAndroidSheetURL);

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


### Initialization

Initialize the project with the Apps Script file id and specify the `dist` directory as the subdirectory to sync.

```console
$ ./node_modules/.bin/gapps init --subdir dist <fileid>
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
