/* ===== SUPABASE CONFIGURATION ===== */
// Paste your Supabase credentials here:
const SUPABASE_URL = "https://ubirtvcrlmvobylhxhie.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaXJ0dmNybG12b2J5bGh4aGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMTYwOTUsImV4cCI6MjA5NTY5MjA5NX0.GCid8TifFckn1MAWz0_WcqBGs-TmBK19a3VCxgg2diI";

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.warn("Supabase credentials not configured. Using hardcoded fallback data.");
}

/* ===== FRAGRANCE DATA ===== */
const fragrances = [
  {
    id: 1,
    name: "Shiyaaka Snow",
    notes: "By Khadlaj",
    family: "fresh",
    type: "EDP",
    rating: 4.5,
    scent: 8,
    longevity: "9+",
    sillage: 7,
    tags: ["Elegant", "Clean", "Soapy"],
    image: "snowy.jpg",
    season: "Fall / Winter"
  },
  {
    id: 2,
    name: "Turathi Blue",
    notes: "BY AFNAN",
    family: "fresh",
    type: "EDP",
    rating: 5,
    scent: 9,
    longevity: "9+",
    sillage: 8,
    tags: ["Luxurious", "Fresh", "Citrusy"],
    image: "snow.jpg",
    season: "Year Round"
  },
  {
    id: 3,
    name: "Rayhaan Lion",
    notes: "By Rayhaan",
    family: ["vanilla", "sweet"],
    type: "EDP",
    rating: 5,
    scent: 9,
    longevity: "12+",
    sillage: 9,
    tags: ["Sweet", "Vanilla", "Pear"],
    image: "Li.jpg",
    season: "Year Round",
  },
  {
    id: 4,
    name: "Vulcan Feu",
    notes: "By French Avenue",
    family: ["citrus", "woody", "fruity", "tropical"],
    type: "EDP",
    rating: 5,
    scent: 9,
    longevity: "9+",
    sillage: 10,
    tags: ["Mango", "Tropical", "Woody", "Fruity"],
    image: "Fe.jpg",
    season: "Year Round",
  },
  {
    id: 5,
    name: "Fakhar Black",
    notes: "By lattafa",
    family: "fresh",
    type: "EDP",
    rating: 3,
    scent: 10,
    longevity: "4+",
    sillage: 5,
    tags: ["Clean", "Fresh", "GreenApple"],
    image: "gre.jpg",
    season: "Year Round",
  },
  {
    id: 6,
    name: "Wood Sage & Sea Salt",
    notes: "By Jo Malone London",
    family: ["citrus", "fresh"],
    type: "Cologne",
    rating: 3,
    scent: 7,
    longevity: "2+",
    sillage: 3,
    tags: ["Fresh", "Citrusy", "Woody"],
    image: "ws.jpg",
    season: "Year Round"
  }
];

/* ===== STATE ===== */
let activeFilters = new Set(["all"]);
let collection = [];
let nextId = fragrances.length + 1;

/* ===== DOM ELEMENTS ===== */
const grid = document.getElementById("collection-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const countEl = document.getElementById("collection-count");
const totalCountEl = document.getElementById("total-count");
const modalOverlay = document.getElementById("modal-overlay");
const addBtn = document.getElementById("btn-add-new");
const modalCloseBtn = document.getElementById("modal-close");
const addForm = document.getElementById("add-form");
const navbar = document.querySelector(".navbar");
const toast = document.getElementById("toast");
const lightboxOverlay = document.getElementById("lightbox-overlay");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxName = document.getElementById("lightbox-name");
const lightboxNotes = document.getElementById("lightbox-notes");
const lightboxCloseBtn = document.getElementById("lightbox-close");
const searchInput = document.getElementById("search-input");
let searchQuery = "";

/* ===== RENDER CARDS ===== */
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      html += '<span class="star">★</span>';
    } else if (i === full && half) {
      html += '<span class="star">★</span>';
    } else {
      html += '<span class="star empty">★</span>';
    }
  }
  return html;
}

function getSettingIcon(setting) {
  switch (setting) {
    case "Day": return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    case "Date Night": return ``;
    case "School": return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    default: return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
  }
}

function createCard(frag, index) {
  const card = document.createElement("article");
  card.className = "frag-card";
  card.style.animationDelay = `${index * 0.07}s`;
  card.setAttribute("data-family", frag.family);
  
  const settingValue = frag.setting;
  const settingHtml = (settingValue && settingValue !== "Versatile") 
    ? `<span class="frag-card-setting">${getSettingIcon(settingValue)} ${settingValue}</span>` 
    : '';

  card.innerHTML = `
    <span class="frag-card-badge">${frag.type}</span>
    <div class="frag-card-image">
      <img src="${frag.image}" alt="${frag.name} fragrance bottle" loading="lazy" />
      ${settingHtml}
    </div>
    <div class="frag-card-body">
      <h3 class="frag-card-name">${frag.name}</h3>
      <p class="frag-card-notes">${frag.notes}</p>
      
      <div class="frag-card-performance">
        <div class="perf-row">
          <span class="perf-label">Longevity</span>
          <div class="perf-bar-track">
            <div class="perf-bar-fill" data-width="${parseInt(frag.longevity) * 10}"></div>
          </div>
          <span class="perf-value">${frag.longevity}</span>
        </div>
        <div class="perf-row">
          <span class="perf-label">Sillage</span>
          <div class="perf-bar-track">
            <div class="perf-bar-fill" data-width="${parseInt(frag.sillage) * 10}"></div>
          </div>
          <span class="perf-value">${frag.sillage}</span>
        </div>
      </div>
      
      <div class="frag-card-rating">
        ${renderStars(frag.rating)}
        ${frag.scent ? `<span class="scent-rating">Scent: <span class="scent-num">${frag.scent}</span></span>` : ''}
      </div>
      
      <div class="frag-card-tags">
        ${frag.tags.map(t => `<span class="frag-tag">${t}</span>`).join("")}
      </div>
      <div class="card-action-row">
        <button class="btn-edit" aria-label="Edit fragrance" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Edit
        </button>
        <button class="btn-delete" aria-label="Delete fragrance" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Delete
        </button>
      </div>
    </div>
  `;

  // Add click listener for lightbox
  card.addEventListener("click", (e) => {
    if (e.target.closest('.btn-delete') || e.target.closest('.btn-edit')) return;
    openLightbox(frag);
  });

  // Add click listener for edit
  const editBtn = card.querySelector('.btn-edit');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal(frag);
  });

  // Add click listener for delete
  const deleteBtn = card.querySelector('.btn-delete');
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${frag.name}?`)) {
      let isCloudError = false;
      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.from('fragrances').delete().eq('id', frag.id);
          if (error) throw error;
        } catch (err) {
          console.error("Error deleting from Supabase:", err);
          isCloudError = true;
        }
      }
      collection = collection.filter(c => c.id !== frag.id);
      localStorage.setItem('localFragrances', JSON.stringify(collection)); // Update local storage
      updateStats();
      renderCollection();
      showToast(isCloudError ? "Removed from local vault." : `${frag.name} deleted.`);
    }
  });

  return card;
}

function renderCollection() {
  let filtered = collection;
  
  if (!activeFilters.has("all")) {
    filtered = filtered.filter(f => {
      const fragFamily = Array.isArray(f.family) ? f.family : [f.family];
      return Array.from(activeFilters).every(filter => fragFamily.includes(filter));
    });
  }
  
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.notes.toLowerCase().includes(q)
    );
  }

  const sortSelect = document.getElementById("sort-select");
  const currentSort = sortSelect ? sortSelect.value : "default";

  if (currentSort === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === "za") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (currentSort === "longest") {
    filtered.sort((a, b) => parseInt(b.longevity || 0) - parseInt(a.longevity || 0));
  } else if (currentSort === "best") {
    filtered.sort((a, b) => (b.scent || 0) - (a.scent || 0));
  } else {
    filtered.sort((a, b) => a.id - b.id);
  }

  // Animate out existing cards
  const existingCards = grid.querySelectorAll(".frag-card");
  existingCards.forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.95)";
  });

  setTimeout(() => {
    grid.innerHTML = "";

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p>No fragrances found in this category.</p>
        </div>
      `;
    } else {
      filtered.forEach((frag, i) => {
        grid.appendChild(createCard(frag, i));
      });
    }

    // Update count
    countEl.textContent = filtered.length;

    // Animate performance bars
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll(".perf-bar-fill").forEach(bar => {
          bar.style.width = bar.dataset.width + "%";
        });
      }, 200);
    });
  }, 150);
}

/* ===== UPDATE STATS ===== */
function updateStats() {
  totalCountEl.textContent = collection.length;
}

/* ===== FILTER LOGIC ===== */
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    
    if (filter === "all") {
      activeFilters.clear();
      activeFilters.add("all");
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    } else {
      if (activeFilters.has("all")) {
        activeFilters.delete("all");
        document.querySelector('.filter-btn[data-filter="all"]').classList.remove("active");
      }
      
      if (activeFilters.has(filter)) {
        activeFilters.delete(filter);
        btn.classList.remove("active");
      } else {
        activeFilters.add(filter);
        btn.classList.add("active");
      }
      
      if (activeFilters.size === 0) {
        activeFilters.add("all");
        document.querySelector('.filter-btn[data-filter="all"]').classList.add("active");
      }
    }
    
    renderCollection();
  });
});

/* ===== SEARCH & SORT LOGIC ===== */
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderCollection();
  });
}

const sortSelect = document.getElementById("sort-select");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    renderCollection();
  });
}

/* ===== NAVBAR SCROLL ===== */
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  lastScroll = scrollY;
}, { passive: true });

/* ===== MODAL ===== */
let editingFragId = null;
let currentImageUrl = "";

function openModal(fragToEdit = null) {
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
  
  const modalTitle = modalOverlay.querySelector("h2");
  addForm.reset();

  if (fragToEdit && fragToEdit.id) {
    editingFragId = fragToEdit.id;
    currentImageUrl = fragToEdit.image || "";
    modalTitle.textContent = "Edit Fragrance";
    
    document.getElementById("frag-name").value = fragToEdit.name || "";
    document.getElementById("frag-brand").value = fragToEdit.notes || "";
    document.getElementById("frag-notes").value = (fragToEdit.tags || []).join(" / ");
    
    document.getElementById("frag-type").value = fragToEdit.type || "EDP";
    document.getElementById("frag-setting").value = (fragToEdit.setting && fragToEdit.setting !== "Versatile") ? fragToEdit.setting : "Day";
    
    const familyCheckboxes = document.querySelectorAll("#frag-family-group input[type='checkbox']");
    familyCheckboxes.forEach(cb => {
      cb.checked = Array.isArray(fragToEdit.family) ? fragToEdit.family.includes(cb.value) : fragToEdit.family === cb.value;
    });

    const lonVal = parseInt(fragToEdit.longevity) || 5;
    document.getElementById("longevity-range").value = lonVal;
    document.getElementById("longevity-val").textContent = lonVal;

    const silVal = parseInt(fragToEdit.sillage) || 5;
    document.getElementById("sillage-range").value = silVal;
    document.getElementById("sillage-val").textContent = silVal;

    const scentVal = parseInt(fragToEdit.scent) || 8;
    document.getElementById("scent-range").value = scentVal;
    document.getElementById("scent-val").textContent = scentVal;

    document.getElementById("frag-rating").value = fragToEdit.rating || 4;
    
    // Image not required when editing
    document.getElementById("frag-image").removeAttribute("required");
  } else {
    editingFragId = null;
    currentImageUrl = "";
    modalTitle.textContent = "Add Fragrance";
    
    document.getElementById("longevity-val").textContent = "5";
    document.getElementById("sillage-val").textContent = "5";
    document.getElementById("scent-val").textContent = "8";
    
    // Image is required when adding
    document.getElementById("frag-image").setAttribute("required", "true");
  }
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
  addForm.reset();
  // Reset range displays
  document.getElementById("longevity-val").textContent = "5";
  document.getElementById("sillage-val").textContent = "5";
  document.getElementById("scent-val").textContent = "8";
}

addBtn.addEventListener("click", () => openModal(null));
modalCloseBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modalOverlay.classList.contains("active")) closeModal();
    if (lightboxOverlay.classList.contains("active")) closeLightbox();
  }
});

/* ===== LIGHTBOX ===== */
function openLightbox(frag) {
  lightboxImg.src = frag.image;
  lightboxName.textContent = frag.name;
  lightboxNotes.textContent = frag.notes;
  lightboxOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightboxOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

lightboxCloseBtn.addEventListener("click", closeLightbox);
lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});

/* ===== RANGE SLIDER DISPLAY ===== */
document.getElementById("longevity-range").addEventListener("input", (e) => {
  document.getElementById("longevity-val").textContent = e.target.value;
});

document.getElementById("sillage-range").addEventListener("input", (e) => {
  document.getElementById("sillage-val").textContent = e.target.value;
});

document.getElementById("scent-range").addEventListener("input", (e) => {
  document.getElementById("scent-val").textContent = e.target.value;
});

/* ===== ADD FRAGRANCE ===== */
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("frag-name").value.trim();
  let brand = document.getElementById("frag-brand").value.trim();
  if (brand && !brand.toLowerCase().startsWith("by ")) {
    brand = "By " + brand;
  }
  const notes = document.getElementById("frag-notes").value.trim();
  const familyCheckboxes = document.querySelectorAll("#frag-family-group input[type='checkbox']:checked");
  const family = Array.from(familyCheckboxes).map(cb => cb.value);
  const type = document.getElementById("frag-type").value;
  const longevity = parseInt(document.getElementById("longevity-range").value);
  const sillage = parseInt(document.getElementById("sillage-range").value);
  const scent = parseInt(document.getElementById("scent-range").value) || 8;
  const rating = parseFloat(document.getElementById("frag-rating").value);
  const imageInput = document.getElementById("frag-image");
  const setting = document.getElementById("frag-setting").value;

  // When editing, image is optional
  if (!name || !brand || !notes) return;
  if (!editingFragId && !imageInput.files[0]) return;

  if (window.location.protocol === 'file:') {
    showToast("❌ STOP! You are still on the file:/// link. Open http://127.0.0.1:8080 in a NEW tab!");
    return;
  }

  const btnSubmit = document.getElementById("btn-submit");
  const originalBtnText = btnSubmit.innerHTML;
  btnSubmit.innerHTML = "Saving...";
  btnSubmit.disabled = true;

  const file = imageInput.files[0];
  let imageUrl = currentImageUrl; // Default to existing image if editing

  if (file && supabaseClient) {
    try {
      // 1. Compress Image via Canvas to guarantee small Base64 String
      imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const MAX_SIZE = 800;
            let width = img.width;
            let height = img.height;
            if (width > height && width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          };
          img.onerror = (err) => reject(err);
        };
        reader.onerror = error => reject(error);
      });
      // Skip Supabase Storage completely. imageUrl is now a base64 string that can be stored in the DB.
    } catch (err) {
      console.error("Error converting image:", err);
      showToast("Error converting image to Base64.");
      btnSubmit.innerHTML = originalBtnText;
      btnSubmit.disabled = false;
      return;
    }
  } else if (file && !supabaseClient) {
    imageUrl = URL.createObjectURL(file);
  }

  const newFrag = {
    name,
    notes: brand,
    family,
    type,
    rating: Math.min(5, Math.max(1, rating)),
    scent,
    longevity: longevity.toString() + "+",
    sillage,
    tags: notes.split("/").map(s => s.trim()),
    image: imageUrl,
    setting: setting,
    season: "Year Round"
  };

  let isCloudError = false;

  if (editingFragId) {
    newFrag.id = editingFragId;
    
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('fragrances')
          .update(newFrag)
          .eq('id', editingFragId);
        if (error) throw error;
      } catch (err) {
        console.error("Error updating fragrance in Supabase:", err);
        isCloudError = true;
      }
    }
    
    // Update local collection
    const index = collection.findIndex(c => c.id === editingFragId);
    if (index !== -1) {
      collection[index] = newFrag;
    }
    localStorage.setItem('localFragrances', JSON.stringify(collection));
    showToast(isCloudError ? "Edits saved to local vault." : `${name} updated!`);
    
  } else {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('fragrances')
          .insert([newFrag])
          .select();
        if (error) throw error;
        
        if (data && data.length > 0) {
          collection.push(data[0]);
        } else {
          await loadData();
        }
      } catch (err) {
        console.error("Error inserting fragrance to Supabase:", err);
        isCloudError = true;
        newFrag.id = nextId++;
        collection.push(newFrag);
      }
    } else {
      newFrag.id = nextId++;
      collection.push(newFrag);
    }
    localStorage.setItem('localFragrances', JSON.stringify(collection));
    showToast(isCloudError ? "Saved to local vault." : `${name} added to your vault!`);
  }

  updateStats();
  renderCollection();
  closeModal();
  
  // Reset button state
  btnSubmit.innerHTML = originalBtnText;
  btnSubmit.disabled = false;

  setTimeout(() => {
    document.querySelectorAll(".frag-card").forEach(card => {
      observer.observe(card);
    });
  }, 500);
});

/* ===== TOAST ===== */
function showToast(message) {
  toast.querySelector(".toast-text").textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ===== SMOKE EFFECT ===== */
function createSmoke() {
  const container = document.getElementById('smoke-container');
  if (!container) return;

  const smoke = document.createElement('div');
  smoke.className = 'smoke-puff';

  // Randomize starting position (edges)
  const startSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  let startX, startY, tx, ty;

  if (startSide === 0) { // top
    startX = Math.random() * window.innerWidth;
    startY = -100;
    tx = (Math.random() - 0.5) * 600 + 'px';
    ty = (Math.random() * 600 + 400) + 'px';
  } else if (startSide === 1) { // right
    startX = window.innerWidth + 100;
    startY = Math.random() * window.innerHeight;
    tx = -(Math.random() * 600 + 400) + 'px';
    ty = (Math.random() - 0.5) * 600 + 'px';
  } else if (startSide === 2) { // bottom
    startX = Math.random() * window.innerWidth;
    startY = window.innerHeight + 100;
    tx = (Math.random() - 0.5) * 600 + 'px';
    ty = -(Math.random() * 600 + 400) + 'px';
  } else { // left
    startX = -100;
    startY = Math.random() * window.innerHeight;
    tx = (Math.random() * 600 + 400) + 'px';
    ty = (Math.random() - 0.5) * 600 + 'px';
  }

  smoke.style.left = `${startX}px`;
  smoke.style.top = `${startY}px`;
  smoke.style.setProperty('--tx', tx);
  smoke.style.setProperty('--ty', ty);

  // Randomize size slightly
  const size = Math.random() * 150 + 100; // 100px to 250px
  smoke.style.width = `${size}px`;
  smoke.style.height = `${size}px`;

  container.appendChild(smoke);

  // Remove after animation completes (12s)
  setTimeout(() => {
    if (container.contains(smoke)) {
      smoke.remove();
    }
  }, 12000);
}

// Start smoke interval
setInterval(createSmoke, 5000);
// Create initial smoke after 1 second
setTimeout(createSmoke, 1000);

/* ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";

      // Animate perf bars when visible
      const bars = entry.target.querySelectorAll(".perf-bar-fill");
      bars.forEach(bar => {
        bar.style.width = bar.dataset.width + "%";
      });
    }
  });
}, observerOptions);

/* ===== LOAD DATABASE DATA ===== */
async function loadData() {
  // 1. Instantly load from local memory so the UI doesn't freeze
  const local = localStorage.getItem('localFragrances');
  if (local) {
    collection = JSON.parse(local);
  } else {
    collection = [...fragrances];
  }
  updateStats();
  renderCollection();

  // 2. Attempt cloud sync in the background (doesn't block the screen)
  if (supabaseClient) {
    supabaseClient
      .from('fragrances')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          // Deduplicate by name and clean up the database
          const uniqueData = [];
          const seenNames = new Set();
          
          data.forEach(item => {
            if (!seenNames.has(item.name)) {
              seenNames.add(item.name);
              uniqueData.push(item);
            } else {
              // Automatically delete the duplicate from the real database
              supabaseClient.from('fragrances').delete().eq('id', item.id).then();
            }
          });
          
          collection = uniqueData;
          localStorage.setItem('localFragrances', JSON.stringify(collection));
          updateStats();
          renderCollection();
        }
      })
      .catch(err => console.error("Background cloud fetch failed:", err));
  }
}

/* ===== AUDIO PLAYER ===== */
const audio = document.getElementById("theme-audio");
const btnMute = document.getElementById("btn-mute");
const volumeSlider = document.getElementById("volume-slider");
const iconSoundOn = document.getElementById("icon-sound-on");
const iconSoundOff = document.getElementById("icon-sound-off");
const musicPrompt = document.getElementById("music-prompt");
const btnCloseMusic = document.getElementById("btn-close-music");
const btnStartMusic = document.getElementById("btn-start-music");
let isMuted = false;

if (audio && btnMute && volumeSlider) {
  audio.volume = 0.15;
  
  if (musicPrompt && btnCloseMusic && btnStartMusic) {
    btnCloseMusic.addEventListener("click", () => {
      musicPrompt.classList.remove("active");
    });
    
    btnStartMusic.addEventListener("click", () => {
      musicPrompt.classList.remove("active");
      if (!isMuted) {
        audio.play().catch(e => console.log("Playback prevented"));
      }
    });
  }

  btnMute.addEventListener("click", () => {
    isMuted = !isMuted;
    audio.muted = isMuted;
    if (isMuted) {
      iconSoundOn.style.display = "none";
      iconSoundOff.style.display = "block";
    } else {
      iconSoundOn.style.display = "block";
      iconSoundOff.style.display = "none";
      // Ensure audio plays if it was paused
      if (audio.paused) {
        audio.play().catch(e => console.log("Autoplay prevented"));
      }
    }
  });

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
    if (audio.volume > 0 && isMuted) {
      btnMute.click();
    } else if (audio.volume == 0 && !isMuted) {
      btnMute.click();
    }
  });

}

/* ===== STARRY BACKGROUND ===== */
function createStars() {
  const container = document.getElementById("stars-container");
  if (!container) return;

  const starCount = 150;
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.className = "bg-star";
    
    // Random position
    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";
    
    // Random size (1px to 2px)
    const size = Math.random() < 0.8 ? "1px" : "2px";
    star.style.width = size;
    star.style.height = size;
    
    // Random opacity and animation
    star.style.opacity = Math.random() * 0.8 + 0.2;
    
    container.appendChild(star);
  }
}

function createShootingStar() {
  const container = document.getElementById("stars-container");
  if (!container) return;
  
  const shoot = document.createElement("div");
  shoot.className = "shooting-star";
  
  // Start from upper right
  shoot.style.top = (Math.random() * 30 - 10) + "vh";
  shoot.style.right = (Math.random() * 40 - 20) + "vw";
  
  // Animate
  shoot.style.animation = "shoot 1.5s ease-out forwards";
  
  container.appendChild(shoot);
  
  setTimeout(() => {
    if (container.contains(shoot)) shoot.remove();
  }, 2000);
}

// Start shooting star every 20 seconds
setInterval(createShootingStar, 20000);
// Wait a bit and show the first one to test
setTimeout(createShootingStar, 5000);

/* ===== INITIALIZE ===== */
document.addEventListener("DOMContentLoaded", async () => {
  createStars();
  await loadData();

  // Observe cards after render
  setTimeout(() => {
    document.querySelectorAll(".frag-card").forEach(card => {
      observer.observe(card);
    });
  }, 500);
});
