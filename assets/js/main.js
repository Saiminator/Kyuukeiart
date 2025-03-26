document.addEventListener('DOMContentLoaded', function() {
  // Shared Modal container elements (used for artwork thumbnails, reference images, and sets)
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  /*-----------------------------------------------------
    ARTWORK PAGE MODAL FUNCTIONALITY (for thumbnails)
  -----------------------------------------------------*/
  let artworkCurrentIndex = 0;
  let artworkImages = [];
  const artworkThumbnails = document.querySelectorAll('.artwork-thumbnail');

  if (artworkThumbnails.length > 0) {
    // Build an array of image URLs from artwork thumbnails and attach click events.
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

    // Attach event listeners for artwork modal navigation
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

  /*-----------------------------------------------------
    CHARACTER PAGE REFERENCE MODAL FUNCTIONALITY
  -----------------------------------------------------*/
  let refCurrentIndex = 0;
  if (document.getElementById('ref-preview') && typeof refImages !== 'undefined' && Array.isArray(refImages) && refImages.length > 0) {
    const refButton = document.getElementById('ref-preview');

    refButton.addEventListener('click', function() {
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

    // Attach reference modal button events (reusing modal buttons)
    modalPrev.addEventListener('click', function() {
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

    // Keyboard navigation for reference modal
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

  /*-----------------------------------------------------
    ARTWORK SET MODAL FUNCTIONALITY
  -----------------------------------------------------*/
  // Variables specifically for set modal (separate from artwork thumbnails)
  let setModalImages = [];
  let setCurrentIndex = 0;

  // Called when a set card is clicked (invoked from the layout via onclick="openSetModal(this)")
  window.openSetModal = function(element) {
    var data = element.parentElement.getAttribute('data-set-images');
    if (data) {
      setModalImages = JSON.parse(data);
      setCurrentIndex = 0;
      modalImg.src = setModalImages[setCurrentIndex];
      modal.style.display = 'flex';
    }
  };

  window.showPrevSetImage = function() {
    if (setModalImages.length > 0) {
      setCurrentIndex = (setCurrentIndex - 1 + setModalImages.length) % setModalImages.length;
      modalImg.src = setModalImages[setCurrentIndex];
    }
  };

  window.showNextSetImage = function() {
    if (setModalImages.length > 0) {
      setCurrentIndex = (setCurrentIndex + 1) % setModalImages.length;
      modalImg.src = setModalImages[setCurrentIndex];
    }
  };

  // For set modal navigation, check if the current modal image is part of setModalImages.
  modalPrev.addEventListener('click', function() {
    if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
      showPrevSetImage();
    }
  });
  modalNext.addEventListener('click', function() {
    if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
      showNextSetImage();
    }
  });

  // Close modal if clicking outside the modal content (works for all modal types)
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
