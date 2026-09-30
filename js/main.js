// Track the current active slide index
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail/dot controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Main display logic
function showSlides(n) {
    let slides = document.getElementsByClassName("my-slides");
    let dots = document.getElementsByClassName("dot");
    
    // Loop back to first slide if passing the last
    if (n > slides.length) { slideIndex = 1 }
    
    // Loop to last slide if pressing back on the first
    if (n < 1) { slideIndex = slides.length }
    
    // Hide all slides initially
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active status from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show the current slide and highlight its matching dot
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Optional: Uncomment the lines below to enable auto-play every 4 seconds
// setInterval(function() {
//     plusSlides(1);
// }, 4000);


const images = document.querySelectorAll(".popup-image");
const popup = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");

images.forEach(image => {
    image.addEventListener("click", () => {
        popupImage.src = image.src;
        popupImage.alt = image.alt;
        popup.style.display = "flex";
    });
});

popup.addEventListener("click", () => {
    popup.style.display = "none";
});