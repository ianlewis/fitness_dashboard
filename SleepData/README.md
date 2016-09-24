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
