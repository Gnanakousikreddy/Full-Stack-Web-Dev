document.addEventListener("DOMContentLoaded", function() {
    // Navbar animation
    const navItems = document.querySelectorAll('.navbar ul li');
    navItems.forEach((li, i) => {
        setTimeout(() => {
            li.classList.add('nav-appear');
        }, 200 + i * 120); 
    });

    // Hero section animation
    const heroChildren = document.querySelectorAll('.hero > *');
    heroChildren.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('hero-appear');
        }, 800 + i * 180); 
    });

    // Typing effect for hero-intro (if you have it)
    const text = "Hi, I'm Gnana Koushik,";
    const target = document.getElementById("hero-typing");
    if (target) {
        let j = 0;
        target.textContent = "";
        function type() {
            if (j < text.length) {
                target.textContent += text.charAt(j);
                j++;
                setTimeout(type, 80);
            } else {
                target.classList.add("typing");
                target.textContent = text;
            }
        }
        // Start typing after hero-intro appears
        setTimeout(type, 800 + 1 * 180 + 400);
    }

    // Photo section animation
    document.querySelector('.photo').classList.add('photo-appear');
    setTimeout(() => {
        document.querySelector("#arrow").classList.add('arrow-appear');
    }, 1600);

    // Gallery section
    const scroller = document.querySelector('.gallery-scroller');
    const images = Array.from(scroller.querySelectorAll('.photo-gallery'));
    const leftArrow = document.querySelector('.gallery-container .arrow.left');
    const rightArrow = document.querySelector('.gallery-container .arrow.right');
    const dots = Array.from(document.querySelectorAll('.gallery-container .dot'));
    const imagesPerSet = 3;
    const totalSets = Math.ceil(images.length / imagesPerSet);
    let currentSet = 0;

    function updateGallery() {
        // Get container width
        const container = document.querySelector('.gallery-container');
        const containerWidth = container.clientWidth;

        // Each image is 30% + 6% gap except after the last image in a set
        const imagePercent = 30;
        const gapPercent = 6;
        // For 3 images: 30 + 6 + 30 + 6 + 30 = 102% (last image has no gap after)
        const setWidthPercent = imagePercent * imagesPerSet + gapPercent * (imagesPerSet - 1);
        const setWidthPx = containerWidth * (setWidthPercent / 100);

        // Calculate offset
        const offset = currentSet * setWidthPx;
        scroller.style.transform = `translateX(-${offset}px)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSet);
        });
    }

    leftArrow.addEventListener('click', () => {
        currentSet = (currentSet - 1 + totalSets) % totalSets;
        updateGallery();
    });

    rightArrow.addEventListener('click', () => {
        currentSet = (currentSet + 1) % totalSets;
        updateGallery();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSet = i;
            updateGallery();
        });
    });

    window.addEventListener('resize', updateGallery);
    updateGallery();
});