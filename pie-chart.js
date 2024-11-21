function PieChart(x, y, diameter) {

  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;

  this.get_radians = function(data) {
    var total = sum(data);
    var radians = [];

    for (let i = 0; i < data.length; i++) {
      radians.push((data[i] / total) * TWO_PI);
    }

    return radians;
  };

  this.draw = function(data, labels, colours, title) {

    // Test that data is not empty and that each input array is the
    // same length.
    if (data.length == 0) {
      alert('Data has length zero!');
    } else if (![labels, colours].every((array) => {
      return array.length == data.length;
    })) {
      alert(`Data (length: ${data.length})
Labels (length: ${labels.length})
Colours (length: ${colours.length})
Arrays must be the same length!`);
    }

    var angles = this.get_radians(data);
    var lastAngle = 0;
    var colour;

    // Draw pie chart segments
    for (var i = 0; i < data.length; i++) {
      if (colours) {
        colour = colours[i];
      } else {
        colour = map(i, 0, data.length, 0, 255);
      }

      fill(colour);
      stroke(0);
      strokeWeight(1);

      arc(this.x, this.y,
          this.diameter, this.diameter,
          lastAngle, lastAngle + angles[i] + 0.001); // Hack for 0!

      if (labels) {
        this.makeLegendItem(labels[i], i, colour);
      }

      lastAngle += angles[i];
    }

    // Draw title
    if (title) {
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.6);
    }

    // Draw tooltip if mouse is over a segment
    this.showTooltip(data, angles);
  };

  this.makeLegendItem = function(label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + (this.labelSpace * i) - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill('black');
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };

  this.showTooltip = function(data, angles) {
    var total = sum(data);
    var lastAngle = 0;
    var tooltipWidth, tooltipHeight = 40;
    
    for (let i = 0; i < data.length; i++) {
      var startAngle = lastAngle;
      var endAngle = lastAngle + angles[i];
      var mouseAngle = atan2(mouseY - this.y, mouseX - this.x);
      if (mouseAngle < 0) {
        mouseAngle += TWO_PI;
      }

      // Check if mouse is within the segment
      if (mouseAngle >= startAngle && mouseAngle < endAngle && dist(mouseX, mouseY, this.x, this.y) < this.diameter / 2) {
        let percentage = (data[i] / total) * 100;
        let tooltipText = `${percentage.toFixed(2)}%`;
        
        // Calculate text width for tooltip
        tooltipWidth = textWidth(tooltipText);
        
        push();
        fill(0);
        textSize(20);
        textAlign(LEFT, TOP);
        rect(mouseX, mouseY, tooltipWidth + 20, tooltipHeight);
        fill(255);
        text(tooltipText, mouseX + 10, mouseY + 10);
        pop();
        break;
      }

      lastAngle += angles[i];
    }
  };
}
