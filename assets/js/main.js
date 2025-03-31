document.addEventListener('DOMContentLoaded', function() {
  /*-----------------------------------------------------
    NSFW CONSENT LOGIC
    (Existing code remains unchanged)
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
      initPanzoom();
    }
    
    function showPrevArtwork() {
      artworkCurrentIndex = (artworkCurrentIndex - 1 + artworkImages.length) % artworkImages.length;
      modalImg.src = artworkImages[artworkCurrentIndex];
      initPanzoom();
    }
    
    function showNextArtwork() {
      artworkCurrentIndex = (artworkCurrentIndex + 1) % artworkImages.length;
      modalImg.src = artworkImages[artworkCurrentIndex];
      initPanzoom();
    }
    
    modalPrev.addEventListener('click', showPrevArtwork);
    modalNext.addEventListener('click', showNextArtwork);
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
      initPanzoom();
    }
    
    function showPrevRef() {
      refCurrentIndex = (refCurrentIndex - 1 + refImages.length) % refImages.length;
      modalImg.src = refImages[refCurrentIndex];
      initPanzoom();
    }
    
    function showNextRef() {
      refCurrentIndex = (refCurrentIndex + 1) % refImages.length;
      modalImg.src = refImages[refCurrentIndex];
      initPanzoom();
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
      initPanzoom();
    }
  };
  
  window.showPrevImage = function() {
    if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
      setCurrentIndex = (setCurrentIndex - 1 + setModalImages.length) % setModalImages.length;
      modalImg.src = setModalImages[setCurrentIndex];
      initPanzoom();
    }
  };
  
  window.showNextImage = function() {
    if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
      setCurrentIndex = (setCurrentIndex + 1) % setModalImages.length;
      modalImg.src = setModalImages[setCurrentIndex];
      initPanzoom();
    }
  };
  
  /*-----------------------------------------------------
    GLOBAL KEYDOWN HANDLER (for modal navigation)
  -----------------------------------------------------*/
  window.addEventListener('keydown', function(event) {
    if (modal.style.display === 'flex') {
      if (event.key === 'ArrowLeft') {
        if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
          showPrevImage();
        } else if (artworkImages.length > 0 && artworkImages.includes(modalImg.src)) {
          showPrevArtwork();
        }
      } else if (event.key === 'ArrowRight') {
        if (setModalImages.length > 0 && setModalImages.includes(modalImg.src)) {
          showNextImage();
        } else if (artworkImages.length > 0 && artworkImages.includes(modalImg.src)) {
          showNextArtwork();
        }
      } else if (event.key === 'Escape') {
        modal.style.display = 'none';
      }
    }
  });
  
  /*-----------------------------------------------------
    Close modal when clicking outside the image
  -----------------------------------------------------*/
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  /*-----------------------------------------------------
    PANZOOM INITIALIZATION
  -----------------------------------------------------*/
  let panzoomInstance;
  function initPanzoom() {
    const container = document.getElementById('panzoom-container');
    if (!container) return;
    // Destroy previous instance if it exists.
    if (panzoomInstance) {
      panzoomInstance.destroy();
    }
    panzoomInstance = Panzoom(container, {
      maxScale: 5,
      minScale: 1,
      contain: 'outside'
    });
    container.addEventListener('wheel', panzoomInstance.zoomWithWheel);
  }
  
  /*-----------------------------------------------------
    SECRET GROUP UNLOCK LOGIC
    Map secret codes to group names.
    Supports multiple secret keywords per item and a master secret to unlock all.
  -----------------------------------------------------*/
  const secretCodes = {
    "MEIMEI": "meimei",
    "BUNNY": "bunny",
    "RAGNA": "ragna"
  };
  
  const MASTER_SECRET = "ALLSECRETS";
  
  function isSecretUnlocked(el) {
    let groups = el.getAttribute("data-secret-group");
    if (!groups) return true;
    groups = groups.split(",").map(g => g.trim());
    return groups.every(g => localStorage.getItem("secret-" + g) === "true");
  }
  
  function hideAllSecretGroups() {
    document.querySelectorAll('.secret').forEach(function(el) {
      const group = el.getAttribute("data-secret-group");
      if (group && localStorage.getItem("secret-" + group) !== "true") {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
  }
  
  function revealSecretGroup(group) {
    document.querySelectorAll('.secret').forEach(function(el) {
      let groups = el.getAttribute("data-secret-group").split(",").map(g => g.trim());
      if (groups.includes(group) && isSecretUnlocked(el)) {
        el.style.display = "";
      }
    });
    updateSecretToggleButtons();
  }
  
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
    Object.keys(secretCodes).forEach(function(code) {
      const group = secretCodes[code];
      if(localStorage.getItem("secret-" + group) === "true"){
        const button = document.createElement("button");
        button.textContent = "Turn off " + group.charAt(0).toUpperCase() + group.slice(1);
        button.addEventListener("click", function(){
          localStorage.setItem("secret-" + group, "false");
          document.querySelectorAll('.secret[data-secret-group="'+group+'"]').forEach(function(el){
            el.style.display = "none";
          });
          updateSecretToggleButtons();
        });
        container.appendChild(button);
      }
    });
  }
  
  // Ensure secret items are hidden by default on page load if not unlocked
  function initialSecretCheck() {
    document.querySelectorAll('.secret').forEach(function(el) {
      const group = el.getAttribute("data-secret-group");
      if (group && localStorage.getItem("secret-" + group) !== "true") {
        el.style.display = "none";
      }
    });
  }
  initialSecretCheck();
  
  updateSecretToggleButtons();
});
