function ImmigrantsToCanada() {
    // visualisation name
    this.name = 'Immigrants to Canada: 1980-2013';

    // visualisation id
    this.id = 'immigrants-to-canada';

    // boolean to represent whether data has been loaded.
    this.loaded = false;

    // preload the data. 
    this.preload = function () {
        var self = this;
        this.data = loadTable(
            './data/immigrants-canada/immigrants-canada-1980-2013.csv', 'csv', 'header',
            // callback function to set the value this.loaded to true.
            function (table) {
                self.loaded = true;
            });
    };

    this.waffles = [];

    this.setup = function () {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }

        this.years = ["1980", "1985", "1990", "1995", "2000", "2005", "2010", "2013"];
        this.countries = this.data.getColumn('OdName');
        

        for (var i = 0; i < this.years.length; i++) {
            // draw a waffle chart in two rows
            if (i < 4) {
                this.waffles.push(new Waffle(20 + (i * 200), 100, 150, 150, 10, 10, this.data, this.years[i], this.countries));
            } else {
                this.waffles.push(new Waffle(20 + (i - 4) * 200, 350, 150, 150, 10, 10, this.data, this.years[i], this.countries));
            }
        }
    };

    this.draw = function () {
        // draw each waffle chart
        for (var i = 0; i < this.waffles.length; i++) {
            this.waffles[i].draw();
        }

        // show a country name when mouse is over a certain part of the waffle chart
        for (var i = 0; i < this.waffles.length; i++) {
            this.waffles[i].checkMouse(mouseX, mouseY);
        }
    };

    this.destroy = function () {};
}