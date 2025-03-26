document.addEventListener('DOMContentLoaded', function() {
  /*-----------------------------------------------------
    NSFW CONSENT LOGIC
  -----------------------------------------------------*/
  (function() {
    const nsfwModal = document.getElementById('nsfw-modal');
    const nsfwYes = document.getElementById('nsfw-yes');
    const nsfwNo = document.getElementById('nsfw-no');

    // Check localStorage on load
    const existingConsent = localStorage.getItem('nsfwConsent');
    if (existingConsent === null) {
      // Show modal if no preference is set
      nsfwModal.style.display = 'flex';
    } else if (existingConsent === 'yes') {
      // Remove blur from all NSFW elements
      document.querySelectorAll('.nsfw').forEach(function(el) {
        el.classList.remove('blurred');
      });
    } else {
      // existingConsent === 'no'
      // Add blur to all NSFW elements
      document.querySelectorAll('.nsfw').forEach(function(el) {
        el.classList.add('blurred');
      });
    }

    // If user clicks YES
    if (nsfwYes) {
      nsfwYes.addEventListener('click', function() {
        localStorage.setItem('nsfwConsent', 'yes');
        nsfwModal.style.display = 'none';
        document.querySelectorAll('.nsfw').forEach(function(el) {
          el.classList.remove('blurred');
        });
      });
    }

    // If user clicks NO
    if (nsfwNo) {
      nsfwNo.addEventListener('click', function() {
        localStorage.setItem('nsfwConsent', 'no');
        nsfwModal.style.display = 'none';
        document.querySelectorAll('.nsfw').forEach(function(el) {
          el.classList.add('blurred');
        });
      });
    }
  })();

  // Home Page Toggle Button (if it exists)
  const toggleBtn = document.getElementById('nsfw-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const current = localStorage.getItem('nsfwConsent');
      if (current === 'yes') {
        localStorage.setItem('nsfwConsent', 'no');
        document.querySelectorAll('.nsfw').forEach(function(el) {
          el.classList.add('blurred');
        });
      } else {
        localStorage.setItem('nsfwConsent', 'yes');
        document.querySelectorAll('.nsfw').forEach(function(el) {
          el.classList.remove('blurred');
        });
      }
    });
  }

  /*-----------------------------------------------------
    ARTWORK PAGE MODAL (Thumbnails)
  -----------------------------------------------------*/
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  let artworkCurrentIndex = 0;
  let artworkImages = [];
  const artworkThumbnails = document.querySelectorAll('.artwork-thumbnail');

  if (artworkThumbnails.length > 0) {
    // Build an array from all .artwork-thumbnail elements
    artworkThumbnails.forEach((thumb, index) => {
      artworkImages.push(thumb.src);
      thumb.addEventListener('click', function() {
        artworkCurrentIndex = index;
        openArtworkModal();
      });
    });

    function openArtworkModal() {
      modal.style.display = 'flex';
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

    // Attach button events
    modalPrev.addEventListener('click', showPrevArtwork);
    modalNext.addEventListener('click', showNextArtwork);
    modalClose.addEventListener('click', closeArtworkModal);

    // Keyboard navigation
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

  // Close modal if clicking outside it
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  /*-----------------------------------------------------
    CHARACTER PAGE REFERENCE MODAL
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

    // Reuse same modal buttons
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

    // Keyboard nav
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
    ARTWORK SET MODAL (Multiple Sets)
  -----------------------------------------------------*/
  let setModalImages = [];
  let setCurrentIndex = 0;

  // Called when a set card is clicked
  window.openSetModal = function(element) {
    var data = element.parentElement.getAttribute('data-set-images');
    if (data) {
      setModalImages = JSON.parse(data);
      setCurrentIndex = 0;
      modalImg.src = setModalImages[setCurrentIndex];
      modal.style.display = 'flex';
    }
  };

  window.showPrevImage = function() {
    if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
      setCurrentIndex = (setCurrentIndex - 1 + setModalImages.length) % setModalImages.length;
      modalImg.src = setModalImages[setCurrentIndex];
    }
  };

  window.showNextImage = function() {
    if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
      setCurrentIndex = (setCurrentIndex + 1) % setModalImages.length;
      modalImg.src = setModalImages[setCurrentIndex];
    }
  };
});
