/**
 * Created by Andrei on 7/17/2017.
 */
if ((window.location.pathname).includes("testReport")) {
    // for debugging
    console.log("Page found!");

    // this function is called once the page is loaded
    window.onload = function () {
        // locate the table
        var table = document.getElementById("testresult");
        var tableBody = table.getElementsByTagName("tbody")[1];
        var rows = tableBody.rows;
        var columns = rows[0].getElementsByTagName("td").length;

        // initialize variables for total values
        var totalDuration = 0, totalFail = 0, totalSkip = 0, totalPass = 0, totalTotal = 0;

        // calculate totals
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
        var newRow = tableBody.insertRow(rows.length);
        var newCells = [];

        for (var i = 0; i < columns; i++) {
            newCells[i] = newRow.insertCell(i);
            newCells[i].style = "text-align: right; font-weight: bold;";
        }

        // write data to the total row
        newCells[0].appendChild(document.createTextNode("Total"));
        newCells[0].style = "text-align:left; font-weight: bold;";
        newCells[1].appendChild(document.createTextNode(totalDuration.toFixed(1).toString() + " sec"));
        newCells[2].appendChild(document.createTextNode(totalFail.toString()));
        newCells[4].appendChild(document.createTextNode(totalSkip.toString()));
        newCells[6].appendChild(document.createTextNode(totalPass.toString()));
        newCells[8].appendChild(document.createTextNode(totalTotal.toString()));
        newCells[9].appendChild(document.createTextNode(""));

    }
}