document.addEventListener('DOMContentLoaded', function() {
  /*-----------------------------------------------------
    NSFW CONSENT LOGIC
  -----------------------------------------------------*/
  (function() {
    const nsfwModal = document.getElementById('nsfw-modal');
    const nsfwYes = document.getElementById('nsfw-yes');
    const nsfwNo = document.getElementById('nsfw-no');
    const toggleBtn = document.getElementById('nsfw-toggle');
    const existingConsent = localStorage.getItem('nsfwConsent');
    
    if (existingConsent === null) {
      nsfwModal.style.display = 'flex';
    } else if (existingConsent === 'yes') {
      document.querySelectorAll('.nsfw-blurred').forEach(function(el) {
        el.classList.remove('nsfw-blurred');
      });
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
  const toggleBtnHome = document.getElementById('nsfw-toggle');
  if (toggleBtnHome) {
    toggleBtnHome.addEventListener('click', function() {
      const current = localStorage.getItem('nsfwConsent');
      if (current === 'yes') {
        localStorage.setItem('nsfwConsent', 'no');
        document.querySelectorAll('.nsfw').forEach(function(el) {
          if (!el.classList.contains('nsfw-blurred')) {
            el.classList.add('nsfw-blurred');
          }
        });
        toggleBtnHome.classList.remove('toggle-on');
        toggleBtnHome.classList.add('toggle-off');
      } else {
        localStorage.setItem('nsfwConsent', 'yes');
        document.querySelectorAll('.nsfw-blurred').forEach(function(el) {
          el.classList.remove('nsfw-blurred');
        });
        toggleBtnHome.classList.remove('toggle-off');
        toggleBtnHome.classList.add('toggle-on');
      }
    });
  }
  
  /*-----------------------------------------------------
    ARTWORK PAGE MODAL (Thumbnails)
  -----------------------------------------------------*/
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');
  const modalCloseButton = document.getElementById('modal-close');
  const modalCounter = document.getElementById('modal-counter');
  const modalImageWrapper = document.getElementById('modal-image-wrapper');
  const modalImageContainer = document.getElementById('modal-image-container');

  let activeImageList = [];
  let activeImageSource = '';
  let activeImageIndex = 0;
  let modalScale = 1;
  let modalMinScale = 1;
  const MODAL_MAX_SCALE = 4;
  let modalTranslateX = 0;
  let modalTranslateY = 0;
  const pointerPositions = new Map();
  let panPointerId = null;
  let isPanning = false;
  let pinchInitialDistance = 0;
  let pinchInitialScale = 1;
  const lastPanPosition = { x: 0, y: 0 };

  function clampScale(value) {
    return Math.min(MODAL_MAX_SCALE, Math.max(modalMinScale, value));
  }

  function setWrapperCursor(isGrabbing) {
    if (!modalImageContainer) return;
    modalImageContainer.classList.toggle('is-grabbing', Boolean(isGrabbing));
  }

  function applyModalTransform() {
    if (!modalImg) return;
    if (Math.abs(modalScale - 1) < 0.0001 && Math.abs(modalTranslateX) < 0.0001 && Math.abs(modalTranslateY) < 0.0001) {
      modalImg.style.transform = '';
    } else {
      modalImg.style.transform = `translate(${modalTranslateX}px, ${modalTranslateY}px) scale(${modalScale})`;
    }
  }

  function clampModalTranslation() {
    if (!modalImg || !modalImageContainer) {
      return;
    }

    const containerRect = modalImageContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    if (containerWidth === 0 || containerHeight === 0) {
      return;
    }

    const naturalWidth = modalImg.naturalWidth || 0;
    const naturalHeight = modalImg.naturalHeight || 0;
    const imageRect = modalImg.getBoundingClientRect();

    const scaledWidth = naturalWidth > 0 ? naturalWidth * modalScale : imageRect.width;
    const scaledHeight = naturalHeight > 0 ? naturalHeight * modalScale : imageRect.height;

    const halfOverflowX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const halfOverflowY = Math.max(0, (scaledHeight - containerHeight) / 2);

    if (halfOverflowX === 0) {
      modalTranslateX = 0;
    } else {
      const maxTranslateX = halfOverflowX / modalScale;
      modalTranslateX = Math.min(Math.max(modalTranslateX, -maxTranslateX), maxTranslateX);
    }

    if (halfOverflowY === 0) {
      modalTranslateY = 0;
    } else {
      const maxTranslateY = halfOverflowY / modalScale;
      modalTranslateY = Math.min(Math.max(modalTranslateY, -maxTranslateY), maxTranslateY);
    }
  }

  function clearPointerState() {
    if (modalImageContainer && typeof modalImageContainer.releasePointerCapture === 'function') {
      pointerPositions.forEach(function(_, pointerId) {
        try {
          modalImageContainer.releasePointerCapture(pointerId);
        } catch (error) {
          /* Ignore release errors */
        }
      });
    }
    pointerPositions.clear();
    isPanning = false;
    panPointerId = null;
    pinchInitialDistance = 0;
    pinchInitialScale = modalScale;
    setWrapperCursor(false);
  }

  function resetModalTransform() {
    clearPointerState();
    if (!modalImg || !modalImageWrapper) {
      modalScale = 1;
      modalMinScale = 1;
      modalTranslateX = 0;
      modalTranslateY = 0;
      applyModalTransform();
      return;
    }
    const rect = modalImageWrapper.getBoundingClientRect();
    const naturalWidth = modalImg.naturalWidth || 0;
    const naturalHeight = modalImg.naturalHeight || 0;
    if (rect.width > 0 && rect.height > 0 && naturalWidth > 0 && naturalHeight > 0) {
      const scaleX = rect.width / naturalWidth;
      const scaleY = rect.height / naturalHeight;
      const containedScale = Math.min(scaleX, scaleY, 1);
      modalMinScale = containedScale > 0 ? containedScale : 1;
    } else {
      modalMinScale = 1;
    }
    modalScale = modalMinScale;
    modalTranslateX = 0;
    modalTranslateY = 0;
    applyModalTransform();
  }

  function updatePanPosition(event) {
    lastPanPosition.x = event.clientX;
    lastPanPosition.y = event.clientY;
  }

  function performZoom(clientX, clientY, targetScale) {
    if (!modalImageContainer || !modalImg) {
      return;
    }
    const clampedScale = clampScale(targetScale);
    const rect = modalImageContainer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      modalScale = clampedScale;
      if (Math.abs(modalScale - modalMinScale) < 0.0001) {
        modalTranslateX = 0;
        modalTranslateY = 0;
      } else {
        clampModalTranslation();
      }
      applyModalTransform();
      return;
    }
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    const currentScale = modalScale;
    modalScale = clampedScale;
    if (Math.abs(clampedScale - currentScale) < 0.000001) {
      if (Math.abs(modalScale - modalMinScale) < 0.0001) {
        modalTranslateX = 0;
        modalTranslateY = 0;
      } else {
        clampModalTranslation();
      }
      applyModalTransform();
      return;
    }
    const imageX = offsetX / currentScale - modalTranslateX;
    const imageY = offsetY / currentScale - modalTranslateY;
    modalTranslateX = offsetX / modalScale - imageX;
    modalTranslateY = offsetY / modalScale - imageY;
    clampModalTranslation();
    if (Math.abs(modalScale - modalMinScale) < 0.0001) {
      modalTranslateX = 0;
      modalTranslateY = 0;
    }
    applyModalTransform();
  }

  function updateModalCounter() {
    if (!modalCounter) return;
    if (Array.isArray(activeImageList) && activeImageList.length > 0) {
      modalCounter.textContent = (activeImageIndex + 1) + ' / ' + activeImageList.length;
      modalCounter.style.display = 'block';
    } else {
      modalCounter.textContent = '';
      modalCounter.style.display = 'none';
    }
  }

  function updateModalImage() {
    if (!modalImg || !Array.isArray(activeImageList) || activeImageList.length === 0) {
      return;
    }
    const currentSrc = activeImageList[activeImageIndex];
    if (currentSrc) {
      resetModalTransform();
      modalImg.src = currentSrc;
    }
    updateModalCounter();
  }

  function openModal(images, startIndex = 0, source = '') {
    if (!modal || !modalImg || !Array.isArray(images)) {
      return;
    }
    const filteredImages = images.filter(Boolean);
    if (filteredImages.length === 0) {
      return;
    }
    activeImageList = filteredImages;
    activeImageSource = source;
    activeImageIndex = Math.min(Math.max(startIndex, 0), activeImageList.length - 1);
    modal.style.display = 'flex';
    if (activeImageSource) {
      modal.setAttribute('data-active-source', activeImageSource);
    } else {
      modal.removeAttribute('data-active-source');
    }
    updateModalImage();
  }

  function closeModalInternal() {
    if (!modal) return;
    modal.style.display = 'none';
    modalImg.src = '';
    activeImageList = [];
    activeImageSource = '';
    activeImageIndex = 0;
    modal.removeAttribute('data-active-source');
    resetModalTransform();
    updateModalCounter();
  }

  function showPrevImageInternal() {
    if (!Array.isArray(activeImageList) || activeImageList.length === 0) {
      return;
    }
    activeImageIndex = (activeImageIndex - 1 + activeImageList.length) % activeImageList.length;
    updateModalImage();
  }

  function showNextImageInternal() {
    if (!Array.isArray(activeImageList) || activeImageList.length === 0) {
      return;
    }
    activeImageIndex = (activeImageIndex + 1) % activeImageList.length;
    updateModalImage();
  }

  window.closeModal = closeModalInternal;
  window.showPrevImage = showPrevImageInternal;
  window.showNextImage = showNextImageInternal;

  if (modalPrev) {
    modalPrev.addEventListener('click', showPrevImageInternal);
  }
  if (modalNext) {
    modalNext.addEventListener('click', showNextImageInternal);
  }
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeModalInternal);
  }

  if (modalImg) {
    modalImg.addEventListener('load', resetModalTransform);
  }

  if (modalImageContainer) {
    modalImageContainer.addEventListener('wheel', function(event) {
      event.preventDefault();
      const zoomFactor = Math.exp(-event.deltaY / 300);
      const newScale = modalScale * zoomFactor;
      performZoom(event.clientX, event.clientY, newScale);
    }, { passive: false });

    modalImageContainer.addEventListener('pointerdown', function(event) {
      if (typeof modalImageContainer.setPointerCapture === 'function') {
        modalImageContainer.setPointerCapture(event.pointerId);
      }
      pointerPositions.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
      if (pointerPositions.size === 1) {
        panPointerId = event.pointerId;
        isPanning = modalScale > modalMinScale + 0.001;
        setWrapperCursor(isPanning);
        updatePanPosition(event);
      } else if (pointerPositions.size === 2) {
        isPanning = false;
        setWrapperCursor(false);
        const points = Array.from(pointerPositions.values());
        pinchInitialDistance = Math.hypot(points[0].clientX - points[1].clientX, points[0].clientY - points[1].clientY);
        pinchInitialScale = modalScale;
      }
    });

    modalImageContainer.addEventListener('pointermove', function(event) {
      if (!pointerPositions.has(event.pointerId)) {
        return;
      }
      pointerPositions.set(event.pointerId, { clientX: event.clientX, clientY: event.clientY });
      if (pointerPositions.size >= 2) {
        const points = Array.from(pointerPositions.values()).slice(0, 2);
        const distance = Math.hypot(points[0].clientX - points[1].clientX, points[0].clientY - points[1].clientY);
        if (pinchInitialDistance === 0) {
          pinchInitialDistance = distance;
          pinchInitialScale = modalScale;
        }
        if (distance > 0 && pinchInitialDistance > 0) {
          const midpointX = (points[0].clientX + points[1].clientX) / 2;
          const midpointY = (points[0].clientY + points[1].clientY) / 2;
          const newScale = pinchInitialScale * (distance / pinchInitialDistance);
          performZoom(midpointX, midpointY, newScale);
        }
      } else if (event.pointerId === panPointerId) {
        const canPan = modalScale > modalMinScale + 0.001;
        if (!canPan && isPanning) {
          isPanning = false;
          setWrapperCursor(false);
        }
        if (canPan && isPanning) {
          const deltaX = event.clientX - lastPanPosition.x;
          const deltaY = event.clientY - lastPanPosition.y;
          modalTranslateX += deltaX / modalScale;
          modalTranslateY += deltaY / modalScale;
          updatePanPosition(event);
          clampModalTranslation();
          applyModalTransform();
        } else {
          updatePanPosition(event);
        }
      }
    });

    function handlePointerEnd(event) {
      if (pointerPositions.has(event.pointerId)) {
        pointerPositions.delete(event.pointerId);
      }
      if (typeof modalImageContainer.releasePointerCapture === 'function') {
        try {
          modalImageContainer.releasePointerCapture(event.pointerId);
        } catch (error) {
          /* Ignore release errors */
        }
      }
      if (pointerPositions.size === 1) {
        const remainingId = pointerPositions.keys().next().value;
        const remainingPos = pointerPositions.get(remainingId);
        if (remainingPos) {
          panPointerId = remainingId;
          isPanning = true;
          setWrapperCursor(true);
          lastPanPosition.x = remainingPos.clientX;
          lastPanPosition.y = remainingPos.clientY;
        }
        pinchInitialDistance = 0;
        pinchInitialScale = modalScale;
      } else if (pointerPositions.size === 0) {
        clearPointerState();
      } else {
        isPanning = false;
        setWrapperCursor(false);
        pinchInitialDistance = 0;
        pinchInitialScale = modalScale;
      }
    }

    modalImageContainer.addEventListener('pointerup', handlePointerEnd);
    modalImageContainer.addEventListener('pointerleave', handlePointerEnd);
    modalImageContainer.addEventListener('pointercancel', handlePointerEnd);

    modalImageContainer.addEventListener('dblclick', function(event) {
      event.preventDefault();
      resetModalTransform();
    });
  }

  window.addEventListener('resize', function() {
    if (modal && modal.style.display === 'flex') {
      resetModalTransform();
    }
  });

  const artworkThumbnails = document.querySelectorAll('.artwork-thumbnail');
  const artworkImages = Array.from(artworkThumbnails).map((thumb) => thumb.getAttribute('src') || thumb.src);

  if (artworkThumbnails.length > 0) {
    artworkThumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', function() {
        openModal(artworkImages, index, 'artwork');
      });
    });
  }
  
  /*-----------------------------------------------------
    CHARACTER PAGE REFERENCE MODAL
  -----------------------------------------------------*/
  if (document.getElementById('ref-preview') && typeof refImages !== 'undefined' && Array.isArray(refImages) && refImages.length > 0) {
    const refButton = document.getElementById('ref-preview');

    refButton.addEventListener('click', function() {
      openModal(refImages, 0, 'reference');
    });
  }
  
  /*-----------------------------------------------------
    ARTWORK SET MODAL (Multiple Sets)
  -----------------------------------------------------*/
  window.openSetModal = function(element) {
    var data = element.parentElement.getAttribute('data-set-images');
    if (data) {
      try {
        const parsedImages = JSON.parse(data);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          openModal(parsedImages, 0, 'set');
        }
      } catch (error) {
        console.error('Failed to parse set images', error);
      }
    }
  };
  
  /*-----------------------------------------------------
    GLOBAL KEYDOWN HANDLER (for modal navigation)
  -----------------------------------------------------*/
  window.addEventListener('keydown', function(event) {
    if (modal && modal.style.display === 'flex') {
      if (event.key === 'ArrowLeft') {
        showPrevImageInternal();
      } else if (event.key === 'ArrowRight') {
        showNextImageInternal();
      } else if (event.key === 'Escape') {
        closeModalInternal();
      }
    }
  });
  
  /*-----------------------------------------------------
    Close modal when clicking outside the image
  -----------------------------------------------------*/
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      closeModalInternal();
    }
  });
  
  /*-----------------------------------------------------
    SECRET GROUP UNLOCK LOGIC
    Map secret codes to group names.
    Now, items can have multiple secret groups (comma-separated).
    Also, a master secret ("ALLSECRETS") unlocks all secret groups.
  -----------------------------------------------------*/
  const secretCodes = {
    "GIRAFE": "girafe",
    "BUNNY": "bunny",
    "CHELSEA": "chelsea",
    "MEIMEI": "meimei",
    "SHIHO": "shiho",
    "MEGUMIN": "megumin",
    "CLOWNPIECE": "clownpiece",
    "CIRNO": "cirno",
    "BISHOP": "bishop",
    "RAGNA": "ragna",
    "ULTIMATIA": "ultimatia",
    "WRATH": "wrath",
    "EXTREME": "extreme",
    "WIP": "wip",
    "TESTING": "testing",
    "LYNA": "lyna",
    "BOCCHI": "bocchi"
  };
  
  const MASTER_SECRET = "ALLSECRETS";
  
  // Helper: Check if an element's secret groups are all unlocked.
  function isSecretUnlocked(el) {
    let groups = el.getAttribute("data-secret-group");
    if (!groups) return true;
    groups = groups.split(",").map(g => g.trim());
    return groups.every(g => localStorage.getItem("secret-" + g) === "true");
  }
  
  // Hide secret items that aren't unlocked.
  function hideAllSecretGroups() {
    document.querySelectorAll('.secret').forEach(function(el) {
      if (!isSecretUnlocked(el)) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
  }
  
  // Reveal a specific secret group.
  function revealSecretGroup(group) {
    document.querySelectorAll('.secret').forEach(function(el) {
      if (el.getAttribute("data-secret-group").split(",").map(g => g.trim()).includes(group)) {
        if (isSecretUnlocked(el)) {
          el.style.display = "";
        }
      }
    });
    updateSecretToggleButtons();
  }
  
  // Master secret: unlock all groups found on the page.
  function revealAllSecrets() {
    const secretElements = document.querySelectorAll('[data-secret-group]');
    let groupsSet = new Set();
    secretElements.forEach(el => {
      let groups = el.getAttribute("data-secret-group").split(",");
      groups.forEach(g => groupsSet.add(g.trim()));
    });
    groupsSet.forEach(group => {
      localStorage.setItem("secret-" + group, "true");
    });
    hideAllSecretGroups();
    updateSecretToggleButtons();
  }
  
  let secretInput = "";
  document.addEventListener("keydown", function(e) {
    secretInput += e.key.toUpperCase();
    if (secretInput.endsWith(MASTER_SECRET)) {
      revealAllSecrets();
      secretInput = "";
      return;
    }
    for (const code in secretCodes) {
      if (secretInput.endsWith(code)) {
        localStorage.setItem("secret-" + secretCodes[code], "true");
        revealSecretGroup(secretCodes[code]);
        secretInput = "";
        break;
      }
    }
    if (secretInput.length > 10) {
      secretInput = secretInput.slice(-10);
    }
  });
  
  function updateSecretToggleButtons(){
    const container = document.getElementById("secret-toggle-container");
    if (!container) return;
    container.innerHTML = "";
    // For each unique secret group present in secretCodes:
    Object.keys(secretCodes).forEach(function(code) {
      const group = secretCodes[code];
      if(localStorage.getItem("secret-" + group) === "true"){
        const button = document.createElement("button");
        button.textContent = "Turn off " + group.charAt(0).toUpperCase() + group.slice(1);
        button.addEventListener("click", function(){
          localStorage.setItem("secret-" + group, "false");
          document.querySelectorAll('.secret[data-secret-group]').forEach(function(el){
            let groups = el.getAttribute("data-secret-group").split(",").map(g => g.trim());
            if (groups.includes(group)) {
              el.style.display = "none";
            }
          });
          updateSecretToggleButtons();
        });
        container.appendChild(button);
      }
    });
  }
  
  hideAllSecretGroups();
  updateSecretToggleButtons();
});




document.addEventListener("DOMContentLoaded", function() {
  // Check the URL query parameters
  const params = new URLSearchParams(window.location.search);
  // If there is at least one parameter...
  if (params.toString().length > 0) {
    // Create a new div to display the secret parameters as plain text.
    const secretParamsDiv = document.createElement("div");
    
    // Now unlock each individual secret group specified by the query string.
    // Here we assume that query parameter keys exactly match the secret group names
    // (e.g. ?meimei&bunny becomes keys "meimei" and "bunny").
    for (const key of params.keys()) {
      // Set the localStorage flag for each secret group.
      localStorage.setItem("secret-" + key, "true");
      // Call revealSecretGroup for each key.
      if (typeof revealSecretGroup === "function") {
        revealSecretGroup(key);
      }
    }
    // Optionally, if you want to unlock everything with a master key:
    if (params.has("allsecrets")) {
      if (typeof revealAllSecrets === "function") {
        revealAllSecrets();
      }
    }
  }
});
