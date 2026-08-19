/* ==========================================================================
   ROSALEIGH TESTIMONIAL QUOTE CAROUSEL ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot-btn');
  if (slides.length === 0) return;

  let currentIdx = 0;
  let autoTimer = null;

  function goToSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
    currentIdx = idx;
  }

  function nextSlide() {
    let next = (currentIdx + 1) % slides.length;
    goToSlide(next);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-index') || '0', 10);
      goToSlide(targetIdx);
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    startAutoPlay();
  }

  const container = document.querySelector('.testimonial-carousel-wrap');
  if (container) {
    container.addEventListener('mouseenter', () => {
      if (autoTimer) clearInterval(autoTimer);
    });
    container.addEventListener('mouseleave', () => {
      startAutoPlay();
    });
  }

  startAutoPlay();
});
