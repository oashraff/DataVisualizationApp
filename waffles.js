
function Waffle(_x, _y, width, height, boxes_across, boxes_down, table, columnHeading, possibleValues) {
    // chart attribute definitions
    this._x = _x;
    this._y = _y;
    this._height = height;
    this._width = width;
    this.boxes_across = boxes_across;
    this.boxes_down = boxes_down;

    this.columnHeading = columnHeading;
    this.column = table.getColumn(columnHeading);
    this.possibleValues = possibleValues;


    var _boxes = [];


this.addCategories = function () {
    
    this._colours = ["brown", "red", "yellow", "purple", "blue", "orange", "pink"];
    this.categories = [];

    //array to store the country data
    var countryData = [];
    for (var i = 0; i < this.possibleValues.length; i++) {
        countryData.push({
            name: this.possibleValues[i],
            count: table.getNum(i, this.columnHeading)
        });
    }

    //sorting the country data by count in descending order
    countryData.sort((a, b) => b.count - a.count);

    // getting the top 7 countries
    var topCountries = countryData.slice(0, 7);
   

    // add the top 7 countries to the categories array
    for (var i = 0; i < topCountries.length; i++) {
        this.categories.push({
            name: topCountries[i].name,
            count: topCountries[i].count,
            colours: this._colours[i % this._colours.length],
            boxes: 0 // initialize box count
        });
    }

    // calculate total number of immigrants
    var totalImmigrants = this.categories.reduce((sum, category) => sum + category.count, 0);

    // calculate the number of boxes for each category
    for (var i = 0; i < this.categories.length; i++) {
        var proportion = this.categories[i].count / totalImmigrants;
        this.categories[i].boxes = Math.round(proportion * (this.boxes_across * this.boxes_down));
    }
};



this.addBoxes = function () {
    var _currentCategory = 0;
    var _currentCategoryBox = 0;

    var _boxWidth = width / this.boxes_across;
    var _boxHeight = height / this.boxes_down;
    
    // loop through the grid chart to create boxes
    for (var i = 0; i < this.boxes_down; i++) {
        _boxes.push([]);
        for (var j = 0; j < this.boxes_across; j++) {
            // check if current category exceeds list
            if (_currentCategory >= this.categories.length) {
                break;
            }
            // check if current category count is >= assigned
            if (_currentCategoryBox >= this.categories[_currentCategory].boxes) {
                _currentCategoryBox = 0;
                _currentCategory++;
               // check again 
                if (_currentCategory >= this.categories.length) {
                    break;
                }
            }
            // create new box
            _boxes[i].push(new Box(
                _x + (j * _boxWidth)+100,
                _y + (i * _boxHeight),
                _boxWidth,
                _boxHeight,
                this.categories[_currentCategory]
            ));
            _currentCategoryBox++;
        }
        if (_currentCategory >= this.categories.length) {
            break;
        }
    }
};

    this.addCategories();
    this.addBoxes();

    this.draw = function () {
        // loop through each box and draw if it is defined (categorised)
        for (var i = 0; i < _boxes.length; i++) {
            for (var j = 0; j < _boxes[i].length; j++) {
                if (_boxes[i][j].category != undefined) {
                    _boxes[i][j].draw()
                }
            }
            // draw column heading
            stroke(0);
            textAlign(LEFT, CENTER);
            textSize(25);
            fill(0);
            text(columnHeading, this._x + 140, this._y - 15);
        }
    };

    this.checkMouse = function (mouseX, mouseY) {
        // loop through each box checking if mouse over
        for (var i = 0; i < _boxes.length; i++) {
            for (var j = 0; j < _boxes[i].length; j++) {

                if (_boxes[i][j].category != undefined) {
                    var _mouseOver = _boxes[i][j].mouseOver(mouseX, mouseY);
                    // display tooltip category info
                    if (_mouseOver != false) {
                        push();
                        fill(0);
                        textSize(20);
                        var tWidth = textWidth(_mouseOver);
                        textAlign(LEFT, TOP);
                        rect(mouseX, mouseY, tWidth + 20, 40);
                        fill(255);
                        text(_mouseOver, mouseX + 10, mouseY + 10);
                        pop();
                        break;
                    }
                }
            }
        }
    };
    
    this.destroy = function(){};
}
