document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  const thumbnails = document.querySelectorAll('.artwork-thumbnail');
  let currentIndex = 0;
  let images = [];

  // Build an array of image URLs from the thumbnails
  thumbnails.forEach((thumb, index) => {
    images.push(thumb.src);
    thumb.addEventListener('click', function() {
      currentIndex = index;
      openModal();
    });
  });

  function openModal() {
    modal.style.display = 'flex'; // Using flex to center content
    modalImg.src = images[currentIndex];
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex];
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex];
  }

  modalClose.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', showPrev);
  modalNext.addEventListener('click', showNext);

  // Close modal if clicking outside the image
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Arrow key support for navigation and closing modal
  window.addEventListener('keydown', function(event) {
    if (modal.style.display === 'flex') {
      if (event.key === 'ArrowLeft') {
        showPrev();
      } else if (event.key === 'ArrowRight') {
        showNext();
      } else if (event.key === 'Escape') {
        closeModal();
      }
    }
  });
});
