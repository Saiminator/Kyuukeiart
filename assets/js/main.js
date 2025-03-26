document.addEventListener('DOMContentLoaded', function() {
  /*-----------------------------------------------------
    NSFW CONSENT LOGIC
  -----------------------------------------------------*/
  (function() {
    const nsfwModal = document.getElementById('nsfw-modal');
    const nsfwYes = document.getElementById('nsfw-yes');
    const nsfwNo = document.getElementById('nsfw-no');

    const existingConsent = localStorage.getItem('nsfwConsent');
    if (existingConsent === null) {
      nsfwModal.style.display = 'flex';
    } else if (existingConsent === 'yes') {
      document.querySelectorAll('.nsfw-blurred').forEach(function(el) {
        el.classList.remove('nsfw-blurred');
      });
      const toggleBtn = document.getElementById('nsfw-toggle');
      if (toggleBtn) {
        toggleBtn.classList.remove('toggle-off');
        toggleBtn.classList.add('toggle-on');
      }
    } else {
      document.querySelectorAll('.nsfw').forEach(function(el) {
        if (!el.classList.contains('nsfw-blurred')) {
          el.classList.add('nsfw-blurred');
        }
      });
      const toggleBtn = document.getElementById('nsfw-toggle');
      if (toggleBtn) {
        toggleBtn.classList.remove('toggle-on');
        toggleBtn.classList.add('toggle-off');
      }
    }

    if (nsfwYes) {
      nsfwYes.addEventListener('click', function() {
        localStorage.setItem('nsfwConsent', 'yes');
        nsfwModal.style.display = 'none';
        document.querySelectorAll('.nsfw-blurred').forEach(function(el) {
          el.classList.remove('nsfw-blurred');
        });
        const toggleBtn = document.getElementById('nsfw-toggle');
        if (toggleBtn) {
          toggleBtn.classList.remove('toggle-off');
          toggleBtn.classList.add('toggle-on');
        }
      });
    }

    if (nsfwNo) {
      nsfwNo.addEventListener('click', function() {
        localStorage.setItem('nsfwConsent', 'no');
        nsfwModal.style.display = 'none';
        document.querySelectorAll('.nsfw').forEach(function(el) {
          if (!el.classList.contains('nsfw-blurred')) {
            el.classList.add('nsfw-blurred');
          }
        });
        const toggleBtn = document.getElementById('nsfw-toggle');
        if (toggleBtn) {
          toggleBtn.classList.remove('toggle-on');
          toggleBtn.classList.add('toggle-off');
        }
      });
    }
  })();

  /*-----------------------------------------------------
    NSFW TOGGLE BUTTON (Home Page)
  -----------------------------------------------------*/
  const toggleBtn = document.getElementById('nsfw-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      const current = localStorage.getItem('nsfwConsent');
      if (current === 'yes') {
        localStorage.setItem('nsfwConsent', 'no');
        document.querySelectorAll('.nsfw').forEach(function(el) {
          if (!el.classList.contains('nsfw-blurred')) {
            el.classList.add('nsfw-blurred');
          }
        });
        toggleBtn.classList.remove('toggle-on');
        toggleBtn.classList.add('toggle-off');
      } else {
        localStorage.setItem('nsfwConsent', 'yes');
        document.querySelectorAll('.nsfw-blurred').forEach(function(el) {
          el.classList.remove('nsfw-blurred');
        });
        toggleBtn.classList.remove('toggle-off');
        toggleBtn.classList.add('toggle-on');
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

    modalPrev.addEventListener('click', showPrevArtwork);
    modalNext.addEventListener('click', showNextArtwork);
    modalClose.addEventListener('click', closeArtworkModal);
  }

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
  }

  /*-----------------------------------------------------
    ARTWORK SET MODAL (Multiple Sets)
  -----------------------------------------------------*/
  let setModalImages = [];
  let setCurrentIndex = 0;

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

  /*-----------------------------------------------------
    GLOBAL KEYDOWN HANDLER (for modal navigation)
  -----------------------------------------------------*/
  window.addEventListener('keydown', function(event) {
    if (modal.style.display === 'flex') {
      // Check if we're in set mode
      if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
        if (event.key === 'ArrowLeft') {
          showPrevImage();
        } else if (event.key === 'ArrowRight') {
          showNextImage();
        } else if (event.key === 'Escape') {
          modal.style.display = 'none';
        }
      } else if (typeof artworkImages !== 'undefined' && artworkImages.length > 0 && artworkImages.includes(modalImg.src)) {
        // Otherwise, assume we're in artwork thumbnail mode
        if (event.key === 'ArrowLeft') {
          showPrevArtwork();
        } else if (event.key === 'ArrowRight') {
          showNextArtwork();
        } else if (event.key === 'Escape') {
          modal.style.display = 'none';
        }
      }
    }
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
