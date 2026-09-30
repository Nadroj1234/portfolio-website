// =========================
// SLIDESHOW
// =========================

let slideIndex = 1;

const slides = document.getElementsByClassName("my-slides");
const dots = document.getElementsByClassName("dot");

// Only run slideshow if this page actually has slides
if (slides.length > 0) {
    showSlides(slideIndex);

    setInterval(function () {
        plusSlides(1);
    }, 4000);
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    if (slides.length === 0) return;

    if (n > slides.length) {
        slideIndex = 1;
    }

    if (n < 1) {
        slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";

    if (dots.length > 0 && dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}


// =========================
// IMAGE POPUP
// =========================

const popupImages = document.querySelectorAll(".popup-image");
const imagePopup = document.getElementById("imagePopup");
const popupImage = document.getElementById("popupImage");
const closePopup = document.querySelector(".close-popup");

popupImages.forEach(function (image) {
    image.addEventListener("click", function () {
        popupImage.src = image.src;
        popupImage.alt = image.alt;
        imagePopup.style.display = "flex";
    });
});

if (closePopup) {
    closePopup.addEventListener("click", function (event) {
        event.stopPropagation();
        imagePopup.style.display = "none";
    });
}

if (imagePopup) {
    imagePopup.addEventListener("click", function (event) {
        if (event.target === imagePopup) {
            imagePopup.style.display = "none";
        }
    });
}