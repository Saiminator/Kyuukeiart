document.addEventListener('DOMContentLoaded', () => {
  // Toggle between gallery and detail page (if applicable)
  const galleryPage = document.getElementById('gallery-page');
  const detailPage = document.getElementById('detail-page');
  const characterCards = document.querySelectorAll('.character-card');
  const backToGallery = document.getElementById('back-to-gallery');

  characterCards.forEach(card => {
    card.addEventListener('click', function() {
      const name = card.getAttribute('data-name');
      const detailTitle = document.getElementById('detail-title');
      if(detailTitle) {
        detailTitle.textContent = name;
      }
      if(galleryPage && detailPage) {
        galleryPage.style.display = 'none';
        detailPage.style.display = 'block';
      }
    });
  });

  if (backToGallery) {
    backToGallery.addEventListener('click', function(e) {
      e.preventDefault();
      if(galleryPage && detailPage) {
        detailPage.style.display = 'none';
        galleryPage.style.display = 'block';
      }
    });
  }

  // Modal functionality for full-screen image gallery
  const modal = document.getElementById('modal');
  const modalMainImage = document.getElementById('modal-main-image');
  const modalThumbnails = document.getElementById('modal-thumbnails');
  const modalClose = document.getElementById('modal-close');

  // Example image arrays for References and Collection
  const refImages = [
    'https://i.imgur.com/9NuAnto.png',
    'https://i.imgur.com/9NuAnto.png',
    'https://i.imgur.com/9NuAnto.png',
    'https://i.imgur.com/9NuAnto.png'
  ];
  const colImages = [
    'https://i.imgur.com/CjWbN5Y.png',
    'https://i.imgur.com/CjWbN5Y.png',
    'https://i.imgur.com/CjWbN5Y.png',
    'https://i.imgur.com/CjWbN5Y.png'
  ];

  function openModal(imageArray) {
    modalThumbnails.innerHTML = '';
    modalMainImage.src = imageArray[0];
    imageArray.forEach(src => {
      const thumb = document.createElement('img');
      thumb.src = src;
      thumb.addEventListener('click', () => {
        modalMainImage.src = src;
      });
      modalThumbnails.appendChild(thumb);
    });
    modal.style.display = 'flex';
  }

  const refPreview = document.getElementById('ref-preview');
  const colPreview = document.getElementById('col-preview');

  if (refPreview) {
    refPreview.addEventListener('click', function() {
      openModal(refImages);
    });
  }
  if (colPreview) {
    colPreview.addEventListener('click', function() {
      openModal(colImages);
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', function() {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modal.style.display = 'none';
    }
  });
});
