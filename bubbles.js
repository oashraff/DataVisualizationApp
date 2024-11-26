function BubbleChart() {
    // Title of the chart
    this.name = 'UK Household Purchases: 1974-2017';

    // ID for chart identification
    this.id = 'bubble-uk-1974-2017';

    // Variables to hold data, bubbles, and year information
    this.data = null;
    this.bubbles = [];
    this.years = [];
    this.currentYear = "1974"; // Default starting year
    this.loaded = false; // Track if the data has been successfully loaded

    // Preload function to load CSV data
    this.preload = async function() {
        try {
            // Load the CSV file asynchronously
            this.data = await new Promise((resolve, reject) => {
                loadTable(
                    'data/bubble/foodData.csv',  // File path
                    'csv',                      // File type
                    'header',                   // Header configuration
                    (table) => resolve(table),  // On success
                    (error) => reject(error)    // On failure
                );
            });

            // Mark data as successfully loaded
            this.loaded = true;

            // Proceed with the setup after successful loading
            this.setup();
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    };

    // Setup function to initialize the bubbles and year dropdown
    this.setup = function() {
        // Ensure data is loaded before setup
        if (!this.loaded) {
            console.error("Data has not been loaded yet!");
            return;
        }

        // Reset bubble and year arrays
        this.bubbles = [];
        this.years = [];

        // Create a dropdown select for year selection
        this.yearSelect = createSelect();
        this.yearSelect.position(305, 60); // Set dropdown position
        this.yearSelect.hide(); // Initially hide dropdown

        // Populate dropdown with available years from the data
        for (var i = 5; i < this.data.getColumnCount(); i++) {
            var s = this.data.columns[i]; // Get the column name (year)
            this.years.push(s); // Add year to the years array
            this.yearSelect.option(s); // Add year as an option in the dropdown
        }

        // Set the default year to the first available year
        this.yearSelect.selected(this.years[0]);

        // Check if yearSelect is properly initialized
        if (this.yearSelect) {
            var self = this; // Ensure 'this' is bound to the current object
            
            // Add event listener for when a new year is selected
            this.yearSelect.changed(function() {
                var yearString = self.yearSelect.value(); // Get selected year
                var yearIndex = self.years.indexOf(yearString); // Find index of the year
                
                // If a valid year is selected, update the current year and bubble sizes
                if (yearIndex !== -1) {
                    self.currentYear = yearString;
                    for (var j = 0; j < self.bubbles.length; j++) {
                        self.bubbles[j].setYear(yearIndex); // Update bubble size based on year
                    }
                } else {
                    // Handle error if the year is not found
                    console.error("Year index not found for:", yearString);
                }
            });
        } else {
            // Error if yearSelect is not defined
            console.error("yearSelect is undefined!");
        }

        // Create bubble objects for each data row
        for (var i = 0; i < this.data.getRowCount(); i++) {
            var r = this.data.getRow(i);
            var name = r.getString("L1"); // Get bubble name (e.g., category name)

            if (name != "") {
                var d = [];
                // Retrieve data for each year for this row (category)
                for (var j = 0; j < this.years.length; j++) {
                    var v = Number(r.get(this.years[j])); // Get value for the year
                    d.push(v); // Add value to the data array
                }

                // Create a new Bubble instance for this category
                var b = new Bubble(name, d);
                b.setYear(0); // Set the initial year (index 0)
                this.bubbles.push(b); // Add the bubble to the list
            }
        }
    };
    
    // Cleanup function to remove the year dropdown when the chart is destroyed
    this.destroy = function() {
        if (this.yearSelect) {
            this.yearSelect.remove(); // Remove the year dropdown from the DOM
        }
    };

    // Draw function to render the chart and update the bubbles
    this.draw = function() {
        background(100); // Set background color

        // Show or hide the year dropdown based on chart ID
        if (this.id === 'bubble-uk-1974-2017') {
            this.yearSelect.show(); // Show dropdown for this chart
        } else {
            this.yearSelect.hide(); // Hide dropdown otherwise
        }

        // Display the currently selected year
        if (this.currentYear) {
            fill(255);
            textSize(25);
            textAlign(CENTER);
            text(this.currentYear.toString(), width / 2, 50); // Show year at top center
            textSize(12);
        }

        // Render and update the bubbles
        push();
        textAlign(CENTER);
        translate(width / 2, height / 2); // Move origin to center of canvas

        // Update and draw each bubble
        for (var i = 0; i < this.bubbles.length; i++) {
            this.bubbles[i].updateDirection(this.bubbles); // Avoid bubble overlap
            this.bubbles[i].draw(); // Draw the bubble
            this.bubbles[i].showTooltip(); // Show tooltip if the bubble is hovered
        }
        pop();
    };
}



// Bubble class represents individual bubbles in the chart
function Bubble(_name, _data) 
{
    this.name = _name; // Bubble's name 
    this.id = getRandomID(); // Unique ID for the bubble
    this.pos = createVector(0, 0); // Initial position of the bubble
    this.dir = createVector(0, 0); // Direction for movement

    this.data = _data; // Data values for different years

    this.color = color(random(0, 255), random(0, 255), random(0, 255)); // Random bubble color
    this.size = 20; // Initial size of the bubble
    this.target_size = this.size; // Target size based on data

    // Draw the bubble on the canvas
    this.draw = function() 
    {
        noStroke();
        fill(this.color); // Fill with the bubble's color
        ellipse(this.pos.x, this.pos.y, this.size); // Draw the bubble

        // Display the name of the bubble at its position
        fill(0);
        text(this.name, this.pos.x, this.pos.y);

        // Update the bubble's position based on its direction
        this.pos.add(this.dir);

        // Smoothly adjust the bubble's size to its target size
        if (this.size < this.target_size) {
            this.size += 1;
        } else if (this.size > this.target_size) {
            this.size -= 1;
        }
    };

    // Update bubble size based on the selected year's data
    this.setYear = function(year_index) 
    {
        var v = this.data[year_index]; // Get the value for the selected year
        this.target_size = map(v, 0, 3600, 5, 200); // Map value to bubble size range
    };

    // Update bubble direction to avoid overlap with other bubbles
    this.updateDirection = function(_bubbles)
    {
        this.dir = createVector(0, 0); // Reset direction
        for (var i = 0; i < _bubbles.length; i++) {
            if (_bubbles[i].id != this.id) {
                var v = p5.Vector.sub(this.pos, _bubbles[i].pos); // Vector between bubbles
                var d = v.mag(); // Distance between bubbles

                // If bubbles are overlapping, adjust direction
                if (d < this.size / 2 + _bubbles[i].size / 2) {
                    if (d == 0) {
                        this.dir.add(p5.Vector.random2D()); // Add random direction if overlapping
                    } else {
                        this.dir.add(v); // Add repulsion direction
                    }
                }
            }
        }
        this.dir.normalize(); // Normalize the direction vector
    };

    // Show tooltip when the bubble is hovered
    this.showTooltip = function() {
        var tooltipWidth, tooltipHeight = 40;
        
        // Check if the mouse is over the bubble
        if (dist(mouseX - width / 2, mouseY - height / 2, this.pos.x, this.pos.y) < this.size / 2) {
            let tooltipText = `${'Size: ' + Math.round(this.size)}`; // Tooltip text with size info

            // Calculate width for the tooltip
            tooltipWidth = textWidth(tooltipText);

            push();
            fill(0);
            textSize(20);
            textAlign(LEFT, TOP);
            // Draw tooltip background
            rect(mouseX - 210, mouseY - 210, tooltipWidth + 50, tooltipHeight);
            fill(255);
            // Display tooltip text
            text(tooltipText, mouseX - 200, mouseY - 200);
            pop();
        }
    };
}

// Function that generates random 10 character ID from given 'alpha'
function getRandomID() 
{
    var alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    var s = "";

    for (var i = 0; i < 10; i++) {
        s += alpha[floor(random(0, alpha.length))];
    }

    return s;
}
