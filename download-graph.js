// Done with the help of the html2canvas.js documentation found on their website

document.addEventListener('DOMContentLoaded', function() {
    const downloadButton = document.getElementById('download-button');

    //click event listener to the download button
    downloadButton.addEventListener('click', function() {
        // Select the canvas element where the graph is drawn
        const canvas = document.querySelector('#canvas-container canvas');

        // Use html2canvas to capture the canvas as an image
        html2canvas(canvas).then(function(canvas) {
            // Create an "a" element to trigger the download
            var link = document.createElement('a');
            link.download = 'visual.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });
});
