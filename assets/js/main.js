document.addEventListener('DOMContentLoaded', function() {
  /*-----------------------------------------------------
    NSFW CONSENT LOGIC
  -----------------------------------------------------*/
  (function() {
    const nsfwModal = document.getElementById('nsfw-modal');
    const nsfwYes   = document.getElementById('nsfw-yes');
    const nsfwNo    = document.getElementById('nsfw-no');
    const toggleBtn = document.getElementById('nsfw-toggle');
    const existing  = localStorage.getItem('nsfwConsent');
    
    if (existing === null) {
      nsfwModal.style.display = 'flex';
    } else if (existing === 'yes') {
      document.querySelectorAll('.nsfw-blurred').forEach(el => el.classList.remove('nsfw-blurred'));
      toggleBtn && toggleBtn.classList.replace('toggle-off','toggle-on');
    } else {
      document.querySelectorAll('.nsfw').forEach(el => el.classList.add('nsfw-blurred'));
      toggleBtn && toggleBtn.classList.replace('toggle-on','toggle-off');
    }
    
    if (nsfwYes) {
      nsfwYes.addEventListener('click', function() {
        localStorage.setItem('nsfwConsent','yes');
        nsfwModal.style.display = 'none';
        document.querySelectorAll('.nsfw-blurred').forEach(el => el.classList.remove('nsfw-blurred'));
        toggleBtn && toggleBtn.classList.replace('toggle-off','toggle-on');
      });
    }
    
    if (nsfwNo) {
      nsfwNo.addEventListener('click', function() {
        localStorage.setItem('nsfwConsent','no');
        nsfwModal.style.display = 'none';
        document.querySelectorAll('.nsfw').forEach(el => el.classList.add('nsfw-blurred'));
        toggleBtn && toggleBtn.classList.replace('toggle-on','toggle-off');
      });
    }
  })();
  
  /*-----------------------------------------------------
    NSFW TOGGLE BUTTON (Home Page)
  -----------------------------------------------------*/
  const toggleBtnHome = document.getElementById('nsfw-toggle');
  if (toggleBtnHome) {
    toggleBtnHome.addEventListener('click', function() {
      const curr = localStorage.getItem('nsfwConsent');
      if (curr === 'yes') {
        localStorage.setItem('nsfwConsent','no');
        document.querySelectorAll('.nsfw').forEach(el=>el.classList.add('nsfw-blurred'));
        toggleBtnHome.classList.replace('toggle-on','toggle-off');
      } else {
        localStorage.setItem('nsfwConsent','yes');
        document.querySelectorAll('.nsfw-blurred').forEach(el=>el.classList.remove('nsfw-blurred'));
        toggleBtnHome.classList.replace('toggle-off','toggle-on');
      }
    });
  }
  
  /*-----------------------------------------------------
    ARTWORK PAGE MODAL (Thumbnails)
  -----------------------------------------------------*/
  const modal       = document.getElementById('modal');
  const modalImg    = document.getElementById('modal-img');
  const modalPrev   = document.getElementById('modal-prev');
  const modalNext   = document.getElementById('modal-next');
  
  let artworkIndex  = 0;
  const artworkImages = [];
  document.querySelectorAll('.artwork-thumbnail').forEach((thumb, i) => {
    artworkImages.push(thumb.src);
    thumb.addEventListener('click', () => {
      artworkIndex = i;
      openArtworkModal();
    });
  });
  
  function openArtworkModal() {
    modal.style.display = 'flex';
    modalImg.src        = artworkImages[artworkIndex];
    initPanzoom();
  }
  function showPrevArtwork() {
    artworkIndex = (artworkIndex - 1 + artworkImages.length) % artworkImages.length;
    modalImg.src = artworkImages[artworkIndex];
    initPanzoom();
  }
  function showNextArtwork() {
    artworkIndex = (artworkIndex + 1) % artworkImages.length;
    modalImg.src = artworkImages[artworkIndex];
    initPanzoom();
  }
  modalPrev && modalPrev.addEventListener('click', showPrevArtwork);
  modalNext && modalNext.addEventListener('click', showNextArtwork);

  /*-----------------------------------------------------
    CHARACTER PAGE REFERENCE MODAL
  -----------------------------------------------------*/
  let refIndex     = 0;
  let refImagesArr = [];
  if (typeof refImages !== 'undefined' && Array.isArray(refImages) && refImages.length) {
    refImagesArr = refImages.slice();
    document.getElementById('ref-preview').addEventListener('click', () => {
      refIndex = 0;
      openRefModal();
    });
    function openRefModal() {
      modal.style.display = 'flex';
      modalImg.src        = refImagesArr[refIndex];
      initPanzoom();
    }
    function showPrevRef() {
      refIndex = (refIndex - 1 + refImagesArr.length) % refImagesArr.length;
      modalImg.src = refImagesArr[refIndex];
      initPanzoom();
    }
    function showNextRef() {
      refIndex = (refIndex + 1) % refImagesArr.length;
      modalImg.src = refImagesArr[refIndex];
      initPanzoom();
    }
    modalPrev.addEventListener('click', () => {
      if (refImagesArr.includes(modalImg.src)) showPrevRef();
    });
    modalNext.addEventListener('click', () => {
      if (refImagesArr.includes(modalImg.src)) showNextRef();
    });
  }

  /*-----------------------------------------------------
    ARTWORK SET MODAL (Multiple Sets)
  -----------------------------------------------------*/
  let setImagesArr = [];
  let setIndex     = 0;
  window.openSetModal = function(el) {
    const data = el.parentElement.getAttribute('data-set-images');
    if (!data) return;
    setImagesArr = JSON.parse(data);
    setIndex     = 0;
    modalImg.src = setImagesArr[0];
    modal.style.display = 'flex';
    initPanzoom();
  };
  window.showPrevImage = function() {
    if (!setImagesArr.includes(modalImg.src)) return;
    setIndex = (setIndex - 1 + setImagesArr.length) % setImagesArr.length;
    modalImg.src = setImagesArr[setIndex];
    initPanzoom();
  };
  window.showNextImage = function() {
    if (!setImagesArr.includes(modalImg.src)) return;
    setIndex = (setIndex + 1) % setImagesArr.length;
    modalImg.src = setImagesArr[setIndex];
    initPanzoom();
  };

  /*-----------------------------------------------------
    KEYBOARD + CLICK OUTSIDE MODAL
  -----------------------------------------------------*/
  window.addEventListener('keydown', e => {
    if (modal.style.display === 'flex') {
      if      (e.key === 'ArrowLeft')  {
        if (setImagesArr.includes(modalImg.src)) showPrevImage();
        else showPrevArtwork();
      }
      else if (e.key === 'ArrowRight') {
        if (setImagesArr.includes(modalImg.src)) showNextImage();
        else showNextArtwork();
      }
      else if (e.key === 'Escape') {
        modal.style.display = 'none';
      }
    }
  });
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  /*-----------------------------------------------------
    PANZOOM INITIALIZATION FUNCTION
  -----------------------------------------------------*/
  let panzoomInstance;
  function initPanzoom() {
    const container = document.getElementById('panzoom-container');
    if (!container) return;
    if (panzoomInstance) panzoomInstance.destroy();
    panzoomInstance = Panzoom(container, {
      maxScale: 5,
      minScale: 1,
      contain: 'outside'
    });
    container.addEventListener('wheel', panzoomInstance.zoomWithWheel);
  }

  /*-----------------------------------------------------
    SECRET GROUP LOGIC (unchanged from yours)
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
    "RAGNA": "ragna",
    "ULTIMATIA": "ultimatia",
    "WRATH": "wrath",
    "EXTREME": "extreme",
    "WIP": "wip",
    "TESTING": "testing"
  };
  const MASTER_SECRET = "ALLSECRETS";

  function isSecretUnlocked(el) {
    const groups = el.getAttribute("data-secret-group");
    if (!groups) return true;
    return groups.split(",").map(g=>g.trim()).every(g=> localStorage.getItem("secret-"+g) === "true");
  }
  function hideAllSecretGroups() {
    document.querySelectorAll('.secret').forEach(el=>{
      el.style.display = isSecretUnlocked(el) ? "" : "none";
    });
  }
  function revealSecretGroup(group) {
    localStorage.setItem("secret-"+group,"true");
    document.querySelectorAll(`.secret[data-secret-group*="${group}"]`).forEach(el=>{
      if (isSecretUnlocked(el)) el.style.display="";
    });
    updateSecretToggleButtons();
  }
  function revealAllSecrets() {
    document.querySelectorAll('[data-secret-group]').forEach(el=>{
      el.getAttribute("data-secret-group").split(",").forEach(g=>{
        localStorage.setItem("secret-"+g.trim(),"true");
      });
    });
    hideAllSecretGroups();
    updateSecretToggleButtons();
  }
  let secretInput = "";
  document.addEventListener("keydown", e=>{
    secretInput += e.key.toUpperCase();
    if (secretInput.endsWith(MASTER_SECRET)) {
      revealAllSecrets();
      secretInput = "";
      return;
    }
    Object.keys(secretCodes).forEach(code=>{
      if (secretInput.endsWith(code)) {
        revealSecretGroup(secretCodes[code]);
        secretInput = "";
      }
    });
    if (secretInput.length > 15) secretInput = secretInput.slice(-15);
  });
  function updateSecretToggleButtons(){
    const container = document.getElementById("secret-toggle-container");
    if (!container) return;
    container.innerHTML="";
    Object.values(secretCodes).forEach(group=>{
      if (localStorage.getItem("secret-"+group)==="true") {
        const btn = document.createElement("button");
        btn.textContent = `Turn off ${group.charAt(0).toUpperCase()+group.slice(1)}`;
        btn.addEventListener("click",()=>{
          localStorage.setItem("secret-"+group,"false");
          hideAllSecretGroups();
          updateSecretToggleButtons();
        });
        container.appendChild(btn);
      }
    });
  }
  hideAllSecretGroups();
  updateSecretToggleButtons();
  
  /*-----------------------------------------------------
    URL‐BASED UNLOCK DISPLAY (for mobile)
  -----------------------------------------------------*/
  document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const keys = Array.from(params.keys()).map(k=>k.toLowerCase());
    if (keys.length) {
      const div = document.createElement("div");
      div.id = "secret-params-display";
      Object.assign(div.style, {
        position:"fixed", bottom:"10px", right:"10px",
        background:"#fff", padding:"5px 10px", border:"1px solid #ccc",
        fontSize:"0.8em", zIndex:"30000"
      });
      div.textContent = "Secret Params: "+keys.join("&");
      document.body.appendChild(div);
    }
    if (keys.includes("allsecrets")) revealAllSecrets();
    else {
      keys.forEach(key=>{
        if (Object.values(secretCodes).includes(key)) revealSecretGroup(key);
      });
    }
  });
});
