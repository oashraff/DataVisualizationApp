function PayGapTimeSeries() {
  // Name for the visualisation to appear in the menu bar.
  this.name = 'Pay gap: 1997-2017';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'pay-gap-timeseries';

  // Title to display above the plot.
  this.title = 'Gender Pay Gap: Average difference between male and female pay.';

  // Names for each axis.
  this.xAxisLabel = 'year';
  this.yAxisLabel = '%';

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and methods.
  this.layout = {
    marginSize: marginSize,
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,
    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },
    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },
    grid: true,
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      './data/pay-gap/all-employees-hourly-pay-by-gender-1997-2017.csv', 'csv', 'header',
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    textSize(16);
    this.startYear = this.data.getNum(0, 'year');
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, 'year');
    this.minPayGap = 0;
    this.maxPayGap = max(this.data.getColumn('pay_gap'));
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    this.drawTitle();
    drawYAxisTickLabels(this.minPayGap, this.maxPayGap, this.layout, this.mapPayGapToHeight.bind(this), 0);
    drawAxis(this.layout);
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    var previous;
    var numYears = this.endYear - this.startYear;
    var xLabelSkip = ceil(numYears / this.layout.numXTickLabels);

    for (var i = 0; i < this.data.getRowCount(); i++) {
      var current = {
        'year': this.data.getNum(i, 'year'),
        'payGap': this.data.getNum(i, 'pay_gap')
      };

      if (previous != null) {
        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapPayGapToHeight(previous.payGap),
          this.mapYearToWidth(current.year),
          this.mapPayGapToHeight(current.payGap)
        );

        // Draw x-axis tick label for the year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(previous.year, this.layout, this.mapYearToWidth.bind(this));
        }

        // Check if the mouse is near the x-axis label (within a threshold)
        var xPos = this.mapYearToWidth(previous.year);
        var yPos = this.mapPayGapToHeight(previous.payGap);
        if (dist(mouseX, mouseY, xPos, yPos) < 10) {
          this.drawTooltip(mouseX, mouseY, previous.year, previous.payGap);
        }
      }

      previous = current;
    }
  };

  // Tooltip drawing function
  this.drawTooltip = function (x, y, year, payGap) {
    push();
    fill(0);
    textSize(14);
    var tooltipText = 'Year: ' + year + '\nPay Gap: ' + nf(payGap, 0, 2) + '%';
    var tWidth = textWidth('Year: ' + year);
    var tHeight = textAscent() + textDescent() + 20;

    // Draw tooltip background
    fill(255);
    stroke(0);
    rect(x - 80, y - tHeight + 50, tWidth + 50, tHeight + 10);

    // Draw the tooltip text
    fill(0);
    noStroke();
    text(tooltipText, x - 20, y - tHeight + 70);
    pop();
  };

  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign('center', 'center');
    text(this.title, (this.layout.plotWidth() / 2) + this.layout.leftMargin, this.layout.topMargin - (this.layout.marginSize / 2));
  };

  this.mapYearToWidth = function (value) {
    return map(value, this.startYear, this.endYear, this.layout.leftMargin, this.layout.rightMargin);
  };

  this.mapPayGapToHeight = function (value) {
    return map(value, this.minPayGap, this.maxPayGap, this.layout.bottomMargin, this.layout.topMargin);
  };
}
