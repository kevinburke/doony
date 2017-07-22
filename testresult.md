## testresult.js

This JavaScript is a lightweight front-end realization of the minor improvement for the Test Result page ([bug tracker issue 35486](https://issues.jenkins-ci.org/browse/JENKINS-35486)).
The idea is to add a **"Total:"** row to the tables that contain test results, so the entire evolution can be tracked.

A brief description of the JavaScript code:
1. Locates pages whose URL contains "testReport"
2. Finds and sums intended column values of the table
3. Inserts new Totals row into the table
4. Inputs calculated total values
5. Adjusts the styles accordingly

### Before

<img src="https://loyolauniversitychicago-my.sharepoint.com/personal/afedorov_luc_edu/_layouts/15/guestaccess.aspx?docid=0d4a6ed56569842eeb545817b4673eca9&authkey=AeCUEJlSw0JaFxqRb3XZoH4" />

### After

<img src="https://loyolauniversitychicago-my.sharepoint.com/personal/afedorov_luc_edu/_layouts/15/guestaccess.aspx?docid=0471da433e5c24d95a76088a3dc56f74c&authkey=Ac4_-dKGI29u3cycPdaiipU" />

### Usage instructions

##### Separately
1. Download **testresult.js** and put it to **~/.jenkins/userContent** directory
2. Install **JQuery** and **Simple Theme** Jenkins plugins
3. Set **Manage Jenkins -> Configure System -> URL of theme JS** field value to "http://localhost:8080/userContent/testresult.js"

##### Within doony scheme
Amend **doony.min.js** with the code from **testresult.js**