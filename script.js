const imageLoader = document.getElementById('imageLoader');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const startNumberInput = document.getElementById('startNumber');
const directionSelect = document.getElementById('direction');
const rotationInput = document.getElementById('rotation');
const numCountInput = document.getElementById('numCount');
const radiusOffsetInput = document.getElementById('radiusOffset');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const offsetXInput = document.getElementById('offsetX');
const offsetYInput = document.getElementById('offsetY');
const exportButton = document.getElementById('exportButton');
const evenOddFilterSelect = document.getElementById('evenOddFilter');

const PADDING = 50; // Pixels of white border around the image
let img = new Image();
let imageLoaded = false;

imageLoader.addEventListener('change', handleImage, false);
startNumberInput.addEventListener('input', draw);
directionSelect.addEventListener('change', draw);
rotationInput.addEventListener('input', draw);
numCountInput.addEventListener('input', draw);
radiusOffsetInput.addEventListener('input', draw);
fontSizeInput.addEventListener('input', draw);
fontColorInput.addEventListener('input', draw);
offsetXInput.addEventListener('input', draw);
offsetYInput.addEventListener('input', draw);
exportButton.addEventListener('click', exportImage);
evenOddFilterSelect.addEventListener('change', draw);


function handleImage(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        img = new Image();
        img.onload = function() {
            // Set canvas size to image size + padding
            canvas.width = img.width + PADDING * 2;
            canvas.height = img.height + PADDING * 2;
            imageLoaded = true;
            draw(); // Draw image and initial numbers
        }
        img.src = event.target.result;
    }
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    } else {
        // Clear canvas if no file is selected
        imageLoaded = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Optionally reset canvas size or show a placeholder
        canvas.width = 300; // Default size
        canvas.height = 150;
    }
}

function draw() {
    if (!imageLoaded) return; // Don't draw if no image is loaded

    // Clear canvas and fill with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the image offset by padding
    ctx.drawImage(img, PADDING, PADDING);

    // Get settings
    const startNumber = parseInt(startNumberInput.value, 10);
    const direction = directionSelect.value;
    const rotationDegrees = parseInt(rotationInput.value, 10);
    const numCount = parseInt(numCountInput.value, 10);
    const radiusOffset = parseInt(radiusOffsetInput.value, 10);
    const fontSize = parseInt(fontSizeInput.value, 10);
    const fontColor = fontColorInput.value;
    const offsetX = parseInt(offsetXInput.value, 10);
    const offsetY = parseInt(offsetYInput.value, 10);

    if (isNaN(startNumber) || isNaN(rotationDegrees) || isNaN(numCount) || numCount <= 0 || isNaN(radiusOffset) || isNaN(fontSize) || fontSize <= 0 || isNaN(offsetX) || isNaN(offsetY)) {
        console.error("Invalid input values");
        return; // Don't draw if inputs are invalid
    }

    // Calculate base center relative to the image
    const baseImageCenterX = PADDING + img.width / 2;
    // Use the previously adjusted vertical center as the base
    const baseImageCenterY = PADDING + img.height * 0.60;

    // Apply manual offsets
    const imageCenterX = baseImageCenterX + offsetX;
    const imageCenterY = baseImageCenterY + offsetY;
    // Base radius on the smaller dimension of the image itself
    const imageBaseRadius = Math.min(img.width / 2, img.height / 2);
    const numberRadius = imageBaseRadius + radiusOffset;

    // Convert rotation to radians
    const rotationRadians = rotationDegrees * Math.PI / 180;

    // Set font properties
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate and draw numbers
    for (let i = 0; i < numCount; i++) {
        const angleIncrement = (2 * Math.PI) / numCount;
        let currentAngle = rotationRadians + (i * angleIncrement * (direction === 'clockwise' ? 1 : -1));

        // Adjust angle based on direction if needed (e.g., start from top)
        // The default calculation starts from the positive X-axis (right)

        const x = imageCenterX + numberRadius * Math.cos(currentAngle);
        const y = imageCenterY + numberRadius * Math.sin(currentAngle);

        // Calculate the number to display, considering direction
        let numberValue;
        if (direction === 'clockwise') {
            numberValue = startNumber + i;
        } else { // counter-clockwise
            numberValue = startNumber + (numCount - 1 - i);
        }

        // Apply even/odd filter
        const evenOddFilter = evenOddFilterSelect.value;
        if (evenOddFilter === 'even' && numberValue % 2 !== 0) {
            continue; // Skip odd numbers
        }
        if (evenOddFilter === 'odd' && numberValue % 2 === 0) {
            continue; // Skip even numbers
        }

        // Format number (e.g., leading zero for single digits)
        const formattedNumber = numberValue.toString().padStart(2, '0');

        ctx.fillText(formattedNumber, x, y);
    }
}

// Initial placeholder state (optional)
function init() {
    canvas.width = 500; // Example initial size
    canvas.height = 300;
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#999";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Load a PNG image to start", canvas.width / 2, canvas.height / 2);
}

function exportImage() {
    if (!imageLoaded) {
        alert("Please load an image first before exporting.");
        return;
    }
    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'image_with_numbers.png'; // Filename for the download
    link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); // Get data URL and suggest download
    link.click(); // Simulate a click to trigger download
}

// Initial placeholder state (optional)
function init() {
    canvas.width = 500; // Example initial size
    canvas.height = 300;
    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#999";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Load a PNG image to start", canvas.width / 2, canvas.height / 2);
}

init(); // Call init to set up the initial canvas state
