/**
 * A front-end realization of the minor improvement for the Test Result page.
 * Adds a "Total:" row to the tables that contain test results, so the entire evolution can be tracked.
 * @link https://issues.jenkins-ci.org/browse/JENKINS-35486
 *
 * @authors Andrei Fedorov (afedorov@luc.edu), Gabriel Borcean (gborcean@luc.edu)
 *
 * For details see testresult.md
 */
if ((window.location.pathname).includes("testReport")) {
    // for debugging
    console.log("Page found!");

    // this function is called once the page is loaded
    window.onload = function () {

        // locate the table
        var header = document.getElementById("testresult").getElementsByTagName("tbody")[0].rows[0];
        var tableBody = document.getElementById("testresult").getElementsByTagName("tbody")[1];
        var rows = tableBody.rows;
        var columns = rows[0].getElementsByTagName("td").length;

        // set up style
        var tableStyle = rows[0].getElementsByTagName("td")[1];
        for (var i = 1; i < header.getElementsByTagName("td").length; i++) {
            header.getElementsByTagName("td")[i].style.textAlign = window.getComputedStyle(tableStyle).textAlign;
        }

        // initialize variables for total row
        var newRow = tableBody.insertRow(rows.length);
        var newCells = [];


        // initialize variables for total values
        var totalDuration = 0, totalFail = 0, totalSkip = 0, totalPass = 0, totalTotal = 0;

        // calculate total values
        for (var i = 0; i < rows.length; i++) {
            var data = rows[i].getElementsByTagName("td");

            for (var j = 0; j < data.length; j++) {
                switch (j) {
                    case 1:
                        totalDuration += parseFloat(data[j].getAttribute("data"));
                        break;
                    case 2:
                        totalFail += parseInt(data[j].innerHTML);
                        break;
                    case 4:
                        totalSkip += parseInt(data[j].innerHTML);
                        break;
                    case 6:
                        totalPass += parseInt(data[j].innerHTML);
                        break;
                    case 8:
                        totalTotal += parseInt(data[j].innerHTML);
                        break;
                    default:
                        break;
                }
            }
        }

        // for debugging
        console.log(totalDuration, totalFail, totalSkip, totalPass, totalTotal);

        // create total row and its cells
        for (var i = 0; i < columns; i++) {
            newCells[i] = newRow.insertCell(i);
            newCells[i].style.textAlign = window.getComputedStyle(tableStyle).textAlign;
            newCells[i].style.fontWeight = "bold";
        }

        // write data to the total row
        switch (columns) {
            case 3:
                newCells[0].appendChild(document.createTextNode("Total"));
                newCells[0].style = "text-align:left; font-weight: bold;";
                newCells[1].appendChild(document.createTextNode(totalDuration.toFixed(1).toString() + " sec"));
                break;
            default:
                newCells[0].appendChild(document.createTextNode("Total"));
                newCells[0].style = "text-align:left; font-weight: bold;";
                newCells[1].appendChild(document.createTextNode(totalDuration.toFixed(1).toString() + " sec"));
                newCells[2].appendChild(document.createTextNode(totalFail.toString()));
                newCells[4].appendChild(document.createTextNode(totalSkip.toString()));
                newCells[6].appendChild(document.createTextNode(totalPass.toString()));
                newCells[8].appendChild(document.createTextNode(totalTotal.toString()));
                newCells[9].appendChild(document.createTextNode(""));
                break;
        }

    }
}
