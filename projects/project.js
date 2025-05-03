let currentSlide = 0;
    const slides = document.querySelector('.slides');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.children.length;

    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }

    function updateSlider() {
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function autoSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    setInterval(autoSlide, 4000); // auto-slide every 4 seconds

    updateSlider(); // initialize