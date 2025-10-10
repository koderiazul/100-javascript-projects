import "./image-gallery.css";

const ImageGallery = {
  view: () => `
    <div id="image-gallery">
      <div class="gallery-thumbs"></div>

      <div class="lightbox hidden">
        <button class="nav-btn close">&times;</button>
        <button class="nav-btn prev">&#10094;</button>
        <button class="nav-btn next">&#10095;</button>
        <div class="slider-wrapper">
          <div class="slider-track"></div>
        </div>
      </div>
    </div>
  `,

  mount() {
    const images = [
      "https://picsum.photos/id/1015/1200/800",
      "https://picsum.photos/id/1025/1200/800",
      "https://picsum.photos/id/1035/1200/800",
      "https://picsum.photos/id/1045/1200/800",
      "https://picsum.photos/id/1055/1200/800",
    ];

    const thumbsEl = document.querySelector("#image-gallery .gallery-thumbs");
    const lightbox = document.querySelector("#image-gallery .lightbox");
    const trackWrapper = lightbox.querySelector(".slider-wrapper");
    const track = lightbox.querySelector(".slider-track");
    const closeBtn = lightbox.querySelector(".close");
    const nextBtn = lightbox.querySelector(".next");
    const prevBtn = lightbox.querySelector(".prev");

    // render thumbnails
    thumbsEl.innerHTML = images
      .map(
        (src, i) =>
          `<img src="${src}" data-index="${i}" class="thumb" alt="Image ${i + 1}"/>`
      )
      .join("");

    // build slides with clones for looping: [last, ...images, first]
    const slides = [images[images.length - 1], ...images, images[0]];
    track.innerHTML = slides
      .map((src) => `<div class="slide"><img src="${src}" alt=""></div>`)
      .join("");

    const slideEls = track.querySelectorAll(".slide");
    let currentIndex = 1; // first real image
    let isAnimating = false;

    const slideWidthVW = 60; // width of each slide in vw
    const sideMarginVW = 2;  // margin between slides

    function updateTrack(instant = false) {
      const offset = -currentIndex * (slideWidthVW + sideMarginVW * 2) + 20; // 20vw to center
      track.style.transition = instant ? "none" : "transform 0.5s ease";
      track.style.transform = `translateX(${offset}vw)`;

      // highlight active slide
      slideEls.forEach((s, i) => {
        s.classList.toggle("active", i === currentIndex);
        s.classList.toggle("prev", i === currentIndex - 1);
        s.classList.toggle("next", i === currentIndex + 1);
      });
    }

    function openLightbox(index) {
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      currentIndex = index + 1; // account for leading clone
      updateTrack(true);
    }

    function closeLightbox() {
      lightbox.classList.add("hidden");
      document.body.style.overflow = "";
    }

    function nextSlide() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex++;
      updateTrack();
    }

    function prevSlide() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex--;
      updateTrack();
    }

    track.addEventListener("transitionend", () => {
      // infinite loop handling
      if (currentIndex === slideEls.length - 1) {
        currentIndex = 1;
        updateTrack(true);
      } else if (currentIndex === 0) {
        currentIndex = slideEls.length - 2;
        updateTrack(true);
      }
      isAnimating = false;
    });

    thumbsEl.querySelectorAll(".thumb").forEach((t) => {
      t.addEventListener("click", () => openLightbox(parseInt(t.dataset.index)));
    });

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    });

    updateTrack(true);
  },
};

export default ImageGallery;
