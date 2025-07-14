// Detects all images named photo1.jpg, photo2.jpg, ... in ./images/
// Loads them into the gallery automatically

const maxPhotos = 20; // Change this to the upper limit you want
let photoPaths = [];

// Test images existence via preloading
function preloadImages(basePath, onLoaded) {
    let count = 1;
    let paths = [];

    function checkNext() {
        const img = new Image();
        const path = `${basePath}photo${count}.jpg`;
        img.onload = function() {
            paths.push(path);
            count++;
            checkNext();
        };
        img.onerror = function() {
            // If not found, stop
            onLoaded(paths);
        };
        img.src = path;
    }
    checkNext();
}

// Initialize gallery after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.photo-gallery');
    const imgElem = gallery.querySelector('.gallery-photo');
    const prevBtn = gallery.querySelector('.photo-prev');
    const nextBtn = gallery.querySelector('.photo-next');

    // Load all available photos
    preloadImages('./images/', function(paths) {
        if (paths.length === 0) return;
        photoPaths = paths.reverse(); // reverse for descending order
        let currentIndex = 0;

        // Show image by index
        function showPhoto(idx) {
            if (idx < 0) idx = photoPaths.length - 1;
            if (idx >= photoPaths.length) idx = 0;
            imgElem.src = photoPaths[idx];
            imgElem.style.display = "block"; // show the image once loaded
            currentIndex = idx;
        }

        // Left button
        prevBtn.onclick = function() {
            showPhoto(currentIndex - 1);
        };
        // Right button
        nextBtn.onclick = function() {
            showPhoto(currentIndex + 1);
        };

        // Scroll wheel for switching
        gallery.addEventListener('wheel', function(e) {
            if (e.deltaY > 0) {
                showPhoto(currentIndex + 1);
            } else if (e.deltaY < 0) {
                showPhoto(currentIndex - 1);
            }
            e.preventDefault();
        });

        // Optional: auto-play on hover
        let autoSwitch = null;
        gallery.addEventListener('mouseenter', function() {
            autoSwitch = setInterval(function() {
                showPhoto(currentIndex + 1);
            }, 3500);
        });
        gallery.addEventListener('mouseleave', function() {
            clearInterval(autoSwitch);
        });

        // Initialize with the latest image as default
        showPhoto(0);
    });
});
