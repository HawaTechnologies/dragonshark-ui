// Add this to the end of the existing file
import './app.jsx';

function adjustScale() {
    // Get the actual viewport width
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate the scale factor
    const scale = viewportWidth / 1920;

    // Apply the scale to the content
    const content = document.querySelector('body');
    content.style.transform = `scale(${scale})`;
    content.style.height = `${viewportHeight / scale}px`;
}

// Adjust the scale on load
window.onload = adjustScale;

// Adjust the scale when the window is resized
window.onresize = adjustScale;