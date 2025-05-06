/* SECRET ITEMS: hidden by default */
.secret {
  display: none;
}

/* RESET & GLOBAL STYLES */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  background: #f4f4f9;
  color: #333;
  padding: 20px;
  text-align: center;
}

/* Remove underlines */
a {
  text-decoration: none;
  color: inherit;
}

/* HEADER & FOOTER */
header, footer {
  background: #fff;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  margin-bottom: 20px;
}
header nav a, footer nav a, footer a {
  margin: 0 10px;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
}
header nav a:hover, footer nav a:hover {
  color: #007BFF;
}

/* MAIN */
main {
  max-width: 1200px;
  margin: 0 auto;
}

/* BUTTONS */
button, .preview-btn {
  background: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s ease;
}
button:hover, .preview-btn:hover {
  background: #0056b3;
}

/* NSFW Toggle Styles */
.nsfw-toggle.toggle-off { background: #d9534f; }
.nsfw-toggle.toggle-on  { background: #6c757d; }

/* BACK BUTTON */
.back-btn {
  margin-bottom: 20px;
  padding: 10px 15px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.back-btn:hover {
  text-decoration: underline;
}

/* Character & Collection Cards */
.character-card {
  display: inline-block;
  width: 250px;  /* updated to 250 */
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  margin: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.character-card:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}

/* Thumbnail & Preview */
.character-thumb {
  width: 100%;
  height: 250px;  /* updated to 250 */
  position: relative;
}
.preview-img {
  width: 100%;
  height: 250px;  /* updated to 250 */
  object-fit: cover;
  display: block;
}
.artwork-thumbnail {
  max-width: 250px; /* updated from 150 to 250 */
  cursor: pointer;
  transition: transform 0.3s ease;
  margin: 5px;
}
.artwork-thumbnail:hover {
  transform: scale(1.05);
}

/* NSFW Blurring & Overlays */
.nsfw-blurred {
  filter: blur(8px);
}
.nsfw-indicator {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(255,0,0,0.7);
  color: #fff;
  padding: 3px 6px;
  font-size: 0.8em;
  border-radius: 3px;
  z-index: 2;
  filter: none !important;
}
.set-count-overlay {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  padding: 3px 6px;
  font-size: 0.8em;
  border-radius: 3px;
  z-index: 2;
  filter: none !important;
}

/* DETAIL PAGES */
.detail-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}
.detail-content, .detail-sidebar {
  text-align: center;
}
.detail-content {
  flex: 2;
}
.detail-sidebar {
  flex: 1;
}
.profile-pic {
  width: 100%;
  max-width: 250px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* MODAL STYLES */
.modal {
  display: none;
  position: fixed;
  z-index: 10000;
  inset: 0;
  background: rgba(0,0,0,0.8);
  justify-content: center;
  align-items: center;
}
.modal-prev, .modal-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  font-weight: bold;
  padding: 10px 20px;
  background: #f4f4f9;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
}
.modal-prev { left: 20px; }
.modal-next { right: 20px; }

/* ─── Panzoom wrapper ───────────────────────────────────────── */
#panzoom-container {
  overflow: hidden;
  max-width: 95%;
  max-height: 95%;
  margin: auto;
}
#panzoom-container img {
  display: block;
  max-width: none;
  cursor: grab;
  user-select: none;
}
#panzoom-container img:active {
  cursor: grabbing;
}

/* MOBILE */
@media (max-width: 768px) {
  .detail-container {
    flex-direction: column;
  }
  .modal-prev, .modal-next {
    font-size: 30px;
    padding: 8px 16px;
  }
}
