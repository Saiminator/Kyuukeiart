document.addEventListener('DOMContentLoaded', function() {
  // Modal container elements (shared between pages)
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  //
  // ARTWORK PAGE MODAL FUNCTIONALITY
  //
  let artworkCurrentIndex = 0;
  let artworkImages = [];
  const artworkThumbnails = document.querySelectorAll('.artwork-thumbnail');

  if (artworkThumbnails.length > 0) {
    // Build artwork images array from thumbnails and attach click events.
    artworkThumbnails.forEach((thumb, index) => {
      artworkImages.push(thumb.src);
      thumb.addEventListener('click', function() {
        artworkCurrentIndex = index;
        openArtworkModal();
      });
    });

    function openArtworkModal() {
      modal.style.display = 'flex'; // show modal using flex for centering
      modalImg.src = artworkImages[artworkCurrentIndex];
      // (Optional) If your modal thumbnails for artwork are built dynamically, do it here.
    }

    function closeArtworkModal() {
      modal.style.display = 'none';
    }

    function showPrevArtwork() {
      artworkCurrentIndex = (artworkCurrentIndex - 1 + artworkImages.length) % artworkImages.length;
      modalImg.src = artworkImages[artworkCurrentIndex];
    }

    function showNextArtwork() {
      artworkCurrentIndex = (artworkCurrentIndex + 1) % artworkImages.length;
      modalImg.src = artworkImages[artworkCurrentIndex];
    }

    // Attach artwork modal button events
    modalPrev.addEventListener('click', showPrevArtwork);
    modalNext.addEventListener('click', showNextArtwork);
    modalClose.addEventListener('click', closeArtworkModal);

    // Keyboard navigation for artwork modal
    window.addEventListener('keydown', function(event) {
      if (modal.style.display === 'flex') {
        if (event.key === 'ArrowLeft') {
          showPrevArtwork();
        } else if (event.key === 'ArrowRight') {
          showNextArtwork();
        } else if (event.key === 'Escape') {
          closeArtworkModal();
        }
      }
    });
  }

  //
  // CHARACTER PAGE REFERENCE MODAL FUNCTIONALITY
  //
  // Assumes that in your character layout you output a JavaScript variable "refImages"
  // containing an array of reference image URLs and a button with id "ref-preview".
  let refCurrentIndex = 0;
  if (document.getElementById('ref-preview') && typeof refImages !== 'undefined' && Array.isArray(refImages) && refImages.length > 0) {
    const refButton = document.getElementById('ref-preview');

    refButton.addEventListener('click', function() {
      // Open modal for references using the first image by default.
      refCurrentIndex = 0;
      openRefModal();
    });

    function openRefModal() {
      modal.style.display = 'flex';
      modalImg.src = refImages[refCurrentIndex];
    }

    function closeRefModal() {
      modal.style.display = 'none';
    }

    function showPrevRef() {
      refCurrentIndex = (refCurrentIndex - 1 + refImages.length) % refImages.length;
      modalImg.src = refImages[refCurrentIndex];
    }

    function showNextRef() {
      refCurrentIndex = (refCurrentIndex + 1) % refImages.length;
      modalImg.src = refImages[refCurrentIndex];
    }

    // We reuse the same modal buttons as artwork; add extra event listeners if needed.
    modalPrev.addEventListener('click', function() {
      // If the modal was opened for references, use reference navigation.
      if (modal.style.display === 'flex' && refImages.includes(modalImg.src)) {
        showPrevRef();
      }
    });

    modalNext.addEventListener('click', function() {
      if (modal.style.display === 'flex' && refImages.includes(modalImg.src)) {
        showNextRef();
      }
    });

    modalClose.addEventListener('click', closeRefModal);

    // Keyboard navigation for reference modal (reuse same handler if modal is active)
    window.addEventListener('keydown', function(event) {
      if (modal.style.display === 'flex' && refImages.includes(modalImg.src)) {
        if (event.key === 'ArrowLeft') {
          showPrevRef();
        } else if (event.key === 'ArrowRight') {
          showNextRef();
        } else if (event.key === 'Escape') {
          closeRefModal();
        }
      }
    });
  }

  // Close modal if clicking outside the image for both pages.
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
