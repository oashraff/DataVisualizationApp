function PayGapByJob2017() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap by job: 2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-by-job-2017';

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Graph properties.
  this.pad = 20;
  this.dotSizeMin = 15;
  this.dotSizeMax = 40;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/occupation-hourly-pay-by-gender-2017.csv', 'csv', 'header',
      function(table) {
        self.loaded = true;
      });

  };

  this.setup = function() {
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    // Draw the axes.
    this.addAxes();

    // Get data from the table object.
    var jobs = this.data.getColumn('job_subtype');
    var propFemale = this.data.getColumn('proportion_female');
    var payGap = this.data.getColumn('pay_gap');
    var numJobs = this.data.getColumn('num_jobs');

    // Convert numerical data from strings to numbers.
    propFemale = stringsToNumbers(propFemale);
    payGap = stringsToNumbers(payGap);
    numJobs = stringsToNumbers(numJobs);

    // Set ranges for axes.
    var propFemaleMin = 0;
    var propFemaleMax = 100;

    var payGapMin = -20;
    var payGapMax = 20;

    var numJobsMin = min(numJobs);
    var numJobsMax = max(numJobs);

    stroke(0);
    strokeWeight(1);
      
    // Colors for interpolation: red, yellow, orange, green
    let colors = [
      color(255, 0, 0), // red
      color(255, 165, 0), // orange
      color(255, 255, 0), // yellow
      color(0, 255, 0) // green
    ];

    for (i = 0; i < this.data.getRowCount(); i++) 
    {
      // Map the number of jobs to a range [0, 3] to pick the correct color pair for interpolation
      let t = map(numJobs[i], numJobsMin, numJobsMax, 0, colors.length - 1);

      // Ensure colorIndex + 1 does not exceed the colors array length
      let colorIndex = floor(t);

      // Handle edge cases where colorIndex is at the last color in the array
      let nextColorIndex = min(colorIndex + 1, colors.length - 1);

      let col = lerpColor(colors[colorIndex], colors[nextColorIndex], t - colorIndex);

      fill(col);

      ellipse(
        map(propFemale[i], propFemaleMin, propFemaleMax,
            this.pad, width - this.pad),
        map(payGap[i], payGapMin, payGapMax,
            height - this.pad, this.pad),
        map(numJobs[i], numJobsMin, numJobsMax,
            this.dotSizeMin, this.dotSizeMax)
      );
    }

  };

  this.addAxes = function () {
    stroke(200);

    // Add vertical line.
    line(width / 2,
         0 + this.pad,
         width / 2,
         height - this.pad);

    // Add horizontal line.
    line(0 + this.pad,
         height / 2,
         width - this.pad,
         height / 2);
  };
}
