// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers (row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers (array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour=0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
       (layout.plotWidth() / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
            layout.bottomMargin / 2);
  rotate(- PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
                             decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign('right', 'center');

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces),
         layout.leftMargin - layout.pad,
         y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Add tick label.
  text(value,
       x,
       layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
         layout.topMargin,
         x,
         layout.bottomMargin);
  }
}
//// --------------------------------------------------------------------
//// Handle .csv Uploads
//// --------------------------------------------------------------------
//
//// Handle file selection
//function handleFile(file) {
//    console.log("File selected:", file.name);
//    if (file.type === 'text' && file.subtype === 'csv') {
//        console.log("CSV file detected, loading table");
//        loadTable(file.data, 'csv', 'header', tableLoaded);
//    } else {
//        window.alert('Not a .csv file!');
//    }
//}
//
//// Handle csv upload
//function handleCsvUpload() {
//    console.log("CSV upload initiated");
//    var fileInput = createFileInput(handleFile);
//    fileInput.parent('canvas-container');
//    fileInput.hide();
//    fileInput.elt.click();
//}
//
//// Handle loaded table
//function tableLoaded(table) {
//    console.log("Table loaded", table);
//    if (table.getRowCount() === 0) {
//        console.error("The CSV file is empty or couldn't be parsed correctly.");
//        return;
//    }
//
//    // Populate dropdown with visualization options
//    let selectElement = document.getElementById('visualization-type');
//    selectElement.innerHTML = ''; // Clear existing options
//
//    gallery.visuals.forEach((visual, index) => {
//        let option = document.createElement('option');
//        option.value = index;
//        option.text = visual.name;
//        selectElement.appendChild(option);
//    });
//
//    // Show the visualization selection dropdown
//    document.getElementById('visualization-selection').style.display = 'block';
//}
//
//// Proceed with selected visualization and prompt for column mappings
//function proceedWithSelection() {
//    let selectElement = document.getElementById('visualization-type');
//    let selectedIndex = parseInt(selectElement.value);
//
//    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= gallery.visuals.length) {
//        alert('Invalid selection!');
//        return;
//    }
//
//    let selectedVisual = gallery.visuals[selectedIndex];
//    console.log("Selected visualization:", selectedVisual.name);
//
//    // Hide dropdown and prompt for column mappings
//    document.getElementById('visualization-selection').style.display = 'none';
//    promptForColumnMappings(selectedVisual);
//}
//
//// Prompt for column mappings
//function promptForColumnMappings(visual) {
//    let requiredColumns = visual.getRequiredColumns();
//    let columnMappings = {};
//
//    requiredColumns.forEach(col => {
//        let columnName = prompt(`Enter column name for ${col}:`);
//        if (columnName) {
//            columnMappings[col] = columnName;
//        } else {
//            alert('Column mapping is required!');
//            return;
//        }
//    });
//
//    // Create new visualization with the loaded data
//    let newVisualization = createVisualization(visual, table, columnMappings);
//
//    // Add new visualization to gallery and select it
//    gallery.addCustomVisualVisual(newVisualization);
//    gallery.selectVisual(newVisualization.id);
//}
//
//// Create new visualization based on selected type
//function createVisualization(baseVisual, table, columnMappings) {
//    console.log("Creating new visualization based on", baseVisual.name);
//    let NewVisualization = function() {
//        baseVisual.call(this);
//        this.data = table;
//        this.columnMappings = columnMappings;
//        this.id = baseVisual.id + '_custom';
//        this.name = baseVisual.name + ' (Custom)';
//    }
//    NewVisualization.prototype = Object.create(baseVisual.prototype);
//    NewVisualization.prototype.constructor = NewVisualization;
//
//    return new NewVisualization();
//}
//

// --------------------------------------------------------------------
// Toggle Fullscreen helper functions
// --------------------------------------------------------------------

var isFullScreen = false;
var fullScreenChart = null;
var fullScreenCanvas;

function toggleFullScreen(gallery) {
    if (!isFullScreen) {
        enterFullScreen(gallery);
    } else {
        exitFullScreen();
    }
}

function enterFullScreen(gallery) {
    if (gallery.selectedVisual != null) {
        isFullScreen = true;
        fullScreenChart = gallery.selectedVisual;

        // Remove existing canvas
        select('canvas').remove();

        // Create a new full-screen canvas
        fullScreenCanvas = createCanvas(windowWidth, windowHeight);
        fullScreenCanvas.parent('canvas-container');
        fullScreenCanvas.position(0,0);

        // Set full-screen style
        let container = select('#canvas-container');
        container.addClass('full-screen');

        // Create and add a close button
        let closeButton = createButton('Close');
        closeButton.class('close-btn');
        closeButton.parent(container);
        closeButton.mousePressed(exitFullScreen);
    }
}

function exitFullScreen() {
    isFullScreen = false;
    fullScreenChart = null;

    // Remove full-screen canvas
    if (fullScreenCanvas) {
        fullScreenCanvas.remove();
    }

    // Restore the original canvas
    let c = createCanvas(1024, 576); 
    c.parent('canvas-container');
    c.position(200,50);

    // Remove full-screen style
    let container = select('#canvas-container');
    container.removeClass('full-screen');

    // Remove close button if it still exists
    let closeButton = select('.close-btn');
    if (closeButton) {
        closeButton.remove();
    }
}

