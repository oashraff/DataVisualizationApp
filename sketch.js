var gallery;

function setup() {
    // Create a canvas to fill the content div from index.html.
    var canvasContainer = select('#canvas-container');
    var c = createCanvas(1024, 576);
    c.parent('canvas-container');
    c.position(200,50); // Position the canvas at a suitable index

    gallery = new Gallery();

    // Add the visualisation objects here.
    gallery.addVisual(new TechDiversityRace());
    gallery.addVisual(new TechDiversityGender());
    gallery.addVisual(new PayGapByJob2017());
    gallery.addVisual(new PayGapTimeSeries());
    gallery.addVisual(new ClimateChange());
    gallery.addVisual(new ImmigrantsToCanada());
    gallery.addVisual(new Heatmap());
    gallery.addVisual(new BubbleChart());

    
    // Add event listener to switch between full-screen and normal view
    canvasContainer.mouseClicked(() => toggleFullScreen(gallery));
}

function draw() {
    background(255);
    if (isFullScreen && fullScreenChart) {
        fullScreenChart.draw();
    } else {
        if (gallery.selectedVisual != null) {
            gallery.selectedVisual.draw();
        }
    }
}
