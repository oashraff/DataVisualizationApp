function StackedBarChart() {
    // Chart title and ID for internal reference
    this.name = 'Flight Delays in USA: 2011 - 2020';
    this.id = 'flight-delays';
    
    // Flag to track if the data is loaded
    this.loaded = false;

    // Data storage for the CSV file and additional properties
    this.data = [];
    this.select = null; // DOM element for year selection
    this.years = []; // Array to store unique years from the dataset
    this.selectedYear = '2011'; // Default selected year

    // Define a fixed set of 15 colors for visual differentiation
    this.colors = [
        '#FF5733', '#33FF57', '#5733FF', '#F5FF33', '#FF33F5', '#33FFFF',
        '#FF6633', '#66FF33', '#FF33CC', '#CCFF33', '#33CCFF', '#FF9933',
        '#33FF99', '#FF3399', '#99FF33'
    ];

    // Preload function to load the CSV file and initialize the setup process
    this.preload = function() {
        var self = this;
        // Load the CSV file with a callback to set data and initialize setup
        this.data = loadTable(
            './data/airports-usa/airports-delays-2011-2020.csv', 'csv', 'header',
            function(table) {
                self.loaded = true; // Mark as loaded
                // Extract unique years from the 'year' column
                self.years = [...new Set(self.data.getColumn('year'))];
                self.setup(); // Initialize chart setup after data is loaded
            });
    };

    // Setup function to initialize the year selector and DOM elements
    this.setup = function() {
        // Check if data is not yet loaded
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Create a dropdown (select) DOM element for selecting a year
        this.select = createSelect();
        this.select.position(305, 60); // Positioning the select dropdown
        this.select.hide(); // Initially hide the dropdown
        
        // Populate the select dropdown with years from the dataset
        for (let i = 0; i < this.years.length; i++) {
            this.select.option(this.years[i]);
        } 
    };

    // Clean up the select dropdown when switching charts
    this.destroy = function() {
        this.select.remove(); // Remove the select element from the DOM
    };
    
    // Main draw function to render the stacked bar chart
    this.draw = function() {
        // Check if data is loaded before drawing
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        // Show or hide the year select dropdown based on the current chart ID
        if (this.id === 'flight-delays') {
            this.select.show(); // Show if it's the current chart
        } else {
            this.select.hide(); // Hide otherwise
        }

        // Object to hold the monthly data for the selected year
        var monthlyData = {};
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Get the selected year from the dropdown
        this.selectedYear = this.select.value();

        // Loop through the data and aggregate delays by month and carrier for the selected year
        for (var i = 0; i < this.data.getRowCount(); i++) {
            var row = this.data.getRow(i);
            if (row.get('year') == this.selectedYear) {
                // Get the month and convert it from numerical to string format
                var month = months[parseInt(row.get('month'), 10) - 1];
                if (!monthlyData[month]) {
                    monthlyData[month] = {};
                }
                // Get the carrier name and add the delay for that carrier in the given month
                var carrier = row.get('carrier_name');
                if (!monthlyData[month][carrier]) {
                    monthlyData[month][carrier] = 0;
                }
                // Aggregate the delay values for each carrier
                monthlyData[month][carrier] += parseFloat(row.get('arr_del15') || 0);
            }
        }

        // Chart dimensions and offsets for drawing
        var chartWidth = (width - 300) / months.length; // Adjust chart width based on the number of months
        var chartHeight = height - 100; // Adjust chart height
        var xOffset = 210; // Offset for placing the chart in the canvas
        var maxHeight = chartHeight - 50; // Maximum height of the bars
        var labels = Object.keys(monthlyData[months[0]]); // Get carrier names for the legend

        // Create a color map for each carrier using the predefined colors
        var colorMap = {};
        for (var i = 0; i < labels.length; i++) {
            colorMap[labels[i]] = this.colors[i % this.colors.length];
        }

        // Loop through each month to draw the stacked bars
        for (var i = 0; i < months.length; i++) {
            var x = i * chartWidth + xOffset; // Calculate x position for each month
            var total = Object.values(monthlyData[months[i]]).reduce((a, b) => a + b, 0); // Sum of delays for the month
            var y = height - 85; // Starting y position for the bars
            var prevY = y; // Track the previous y position for stacking bars
            var dataValues = Object.values(monthlyData[months[i]]);
            var dataKeys = Object.keys(monthlyData[months[i]]);

            // Draw bars for each carrier in the selected month
            for (var j = 0; j < dataValues.length; j++) {
                var value = dataValues[j];
                if (value > 0) {
                    // Calculate the height of each bar based on its value proportion
                    var barHeight = (value / total) * maxHeight;
                    fill(colorMap[dataKeys[j]]); // Set the fill color for each carrier
                    rect(x, prevY - barHeight, chartWidth, barHeight); // Draw the rectangle
                    prevY -= barHeight; // Update the y position for the next stacked bar
                }
            }
        }

        // Draw month labels below the chart
        fill(0);
        textSize(10);
        textAlign(CENTER, CENTER);
        for (var i = 0; i < months.length; i++) {
            text(months[i], i * chartWidth + xOffset + chartWidth / 2, height - 25);
        }

        // Draw the legend for carrier names with corresponding colors
        textAlign(LEFT, CENTER);
        for (var i = 0; i < labels.length; i++) {
            fill(this.colors[i % this.colors.length]); // Set fill color for the legend
            rect(50, 60 + i * 20, 20, 20); // Draw the color box for each carrier
            fill(0);
            text(labels[i], 75, 70 + i * 20); // Label each carrier next to the color box
        }
    };
}
