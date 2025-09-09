// بيانات الأماكن
const places = [
  { id: 1, type: "hotel", city: "القاهرة", name: "فندق النيل", price: 120, rating: 4, img: "R (1).jpeg" },
  { id: 2, type: "hall", city: "الإسكندرية", name: "قاعة العروس", price: 200, rating: 5, img: "OIP (22).jpeg" },
  { id: 3, type: "stadium", city: "الجيزة", name: "ملعب الجيزة", price: 80, rating: 3, img: "R (2).jpeg" },
  { id: 4, type: "hotel", city: "أسوان", name: "فندق النوبة", price: 150, rating: 4, img: "Nubian-Hotels-Aswan-3.jpg" },
  { id: 5, type: "hall", city: "المنصورة", name: "قاعة النخيل", price: 180, rating: 4, img: "R (3).jpeg" },
  { id: 6, type: "stadium", city: "سوهاج", name: "ملعب سوهاج", price: 90, rating: 3, img: "R (4).jpeg" },
  { id: 7, type: "hotel", city: "الإسكندرية", name: "فندق البحر", price: 130, rating: 5, img: "R (5).jpeg" },
  { id: 8, type: "hall", city: "القاهرة", name: "قاعة الرحاب", price: 220, rating: 5, img: "preview_k-aa-lrh-b_SFxpP1KO.jpeg" },
  { id: 9, type: "stadium", city: "الأسكندرية", name: "ملعب النجوم", price: 75, rating: 4, img: "GD-EG-Alex-Stade002.JPG" },
  { id: 10, type: "hotel", city: "الغردقة", name: "فندق المرجان", price: 140, rating: 5, img: "R (6).jpeg" },
];

// الترجمات
const translations = {
  ar: {
    heroTitle: "احجز مكانك بسهولة",
    heroSubtitle: "فنادق - قاعات - ملاعب في مصر",
    searchPlaceholder: "المدينة",
    searchBtn: "بحث",
    all: "الكل",
    hotel: "فندق",
    hall: "قاعة",
    stadium: "ملعب",
    favAdd: "أضف للمفضلة",
    favRemove: "إزالة من المفضلة",
    book: "احجز الآن",
    noResults: "لا توجد نتائج",
    showFavOnly: "عرض المفضلة فقط",
    showAll: "عرض الكل",
    details: "اضغط هنا لمعرفة اكتر عن المكان ✅",
    modalTitle: "بيانات الحجز",
    confirmBtn: "تأكيد الحجز",
    modalConfirm: (place) => `تم تأكيد الحجز في ${place}، شكراً لك!`,
    footer: "© 2025 موقع الحجوزات. تواصل معنا:",
  },
  en: {
    heroTitle: "Book Your Place Easily",
    heroSubtitle: "Hotels - Halls - Stadiums in Egypt",
    searchPlaceholder: "City",
    searchBtn: "Search",
    all: "All",
    hotel: "Hotel",
    hall: "Hall",
    stadium: "Stadium",
    favAdd: "Add to Favorites",
    favRemove: "Remove from Favorites",
    book: "Book Now",
    noResults: "No results found",
    showFavOnly: "Show Favorites Only",
    showAll: "Show All",
    details: "Click here to know more about this place ✅",
    modalTitle: "Booking Information",
    confirmBtn: "Confirm Booking",
    modalConfirm: (place) => `Booking confirmed at ${place}, thank you!`,
    footer: "© 2025 Booking Website. Contact us:",
  },
  fr: {
    heroTitle: "Réservez votre place facilement",
    heroSubtitle: "Hôtels - Salles - Stades en Égypte",
    searchPlaceholder: "Ville",
    searchBtn: "Rechercher",
    all: "Tous",
    hotel: "Hôtel",
    hall: "Salle",
    stadium: "Stade",
    favAdd: "Ajouter aux Favoris",
    favRemove: "Supprimer des Favoris",
    book: "Réserver Maintenant",
    noResults: "Aucun résultat trouvé",
    showFavOnly: "Afficher les Favoris uniquement",
    showAll: "Afficher Tout",
    details: "Cliquez ici pour en savoir plus ✅",
    modalTitle: "Informations de Réservation",
    confirmBtn: "Confirmer la Réservation",
    modalConfirm: (place) => `Réservation confirmée à ${place}, merci !`,
    footer: "© 2025 Site de Réservation. Contactez-nous:",
  },
};

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showingFavoritesOnly = false;
let selectedPlaceName = null;
let currentLang = localStorage.getItem("lang") || "ar";

// عناصر DOM
const resultsContainer = document.getElementById("results");
const bookingModal = document.getElementById("bookingModal");
const closeModalBtn = bookingModal.querySelector(".close");
const bookingForm = document.getElementById("bookingForm");
const darkModeBtn = document.getElementById("darkModeBtn");
const showFavoritesBtn = document.getElementById("showFavoritesBtn");
const uploadInput = document.getElementById("uploadInput");

// عرض الكروت
function renderPlaces(list) {
  resultsContainer.innerHTML = "";
  if (list.length === 0) {
    resultsContainer.innerHTML = `<p style="grid-column:1/-1;text-align:center;">${translations[currentLang].noResults}</p>`;
    return;
  }
  list.forEach((place) => {
    const isFav = favorites.includes(place.id);
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <img src="${place.img}" alt="${place.name}" loading="lazy" />
      <div class="card-body">
        <h3>${place.name}</h3>
        <p>${translations[currentLang].searchPlaceholder}: ${place.city}</p>
        <p>${translations[currentLang].price || "Price"}: $${place.price}</p>
        <p class="details-description">${translations[currentLang].details}</p>
        <p class="rating">${"⭐".repeat(place.rating)}${"☆".repeat(5 - place.rating)}</p>
        <button class="btn fav-btn">${isFav ? translations[currentLang].favRemove : translations[currentLang].favAdd}</button>
        <button class="btn book-btn" style="margin-top:10px; background: #00b894;">${translations[currentLang].book}</button>
      </div>
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      window.location.href = `${place.id}.html`;
    });
    card.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(place.id);
      renderPlaces(showingFavoritesOnly ? filterFavorites() : filterResults(false));
    });
    card.querySelector(".book-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openBookingModal(place.name);
    });
    resultsContainer.appendChild(card);
  });
}

// فلترة
function filterResults(updateRender = true) {
  const cityVal = document.getElementById("city").value.trim();
  const typeVal = document.getElementById("type").value;
  let filtered = places.filter((p) => {
    const cityMatch = cityVal === "" || p.city.includes(cityVal);
    const typeMatch = typeVal === "" || p.type === typeVal;
    return cityMatch && typeMatch;
  });
  if (updateRender) {
    showingFavoritesOnly = false;
    showFavoritesBtn.textContent = translations[currentLang].showFavOnly;
    renderPlaces(filtered);
  }
  return filtered;
}

// مفضلة
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
function filterFavorites() {
  return places.filter((p) => favorites.includes(p.id));
}
showFavoritesBtn.addEventListener("click", () => {
  showingFavoritesOnly = !showingFavoritesOnly;
  showFavoritesBtn.textContent = showingFavoritesOnly ? translations[currentLang].showAll : translations[currentLang].showFavOnly;
  renderPlaces(showingFavoritesOnly ? filterFavorites() : filterResults(false));
});

// مودال
function openBookingModal(placeName) {
  selectedPlaceName = placeName;
  bookingModal.classList.add("show");
}
function closeBookingModal() {
  bookingModal.classList.remove("show");
  bookingForm.reset();
}
closeModalBtn.addEventListener("click", closeBookingModal);
bookingForm.addEventListener("submit", (e) => {
  // هنا مش هنعمل preventDefault عشان الفورم يتبعت فعلاً
  document.getElementById("selectedPlace").value = selectedPlaceName;
});


// الوضع الليلي
function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark");
    darkModeBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    darkModeBtn.textContent = "🌙";
  }
  localStorage.setItem("darkMode", enabled ? "true" : "false");
}
darkModeBtn.addEventListener("click", () => setDarkMode(!document.body.classList.contains("dark")));
if (localStorage.getItem("darkMode") === "true") setDarkMode(true);

// رفع صورة
uploadInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      places.push({
        id: Date.now(),
        type: "hotel",
        city: translations[currentLang].searchPlaceholder,
        name: currentLang === "ar" ? "مكان جديد" : currentLang === "en" ? "New Place" : "Nouvel Endroit",
        price: 100,
        rating: 4,
        img: ev.target.result,
      });
      renderPlaces(showingFavoritesOnly ? filterFavorites() : filterResults(false));
    };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
});

// تغيير اللغة
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.querySelector(".hero h1").textContent = translations[lang].heroTitle;
  document.querySelector(".hero p").textContent = translations[lang].heroSubtitle;
  document.getElementById("city").placeholder = translations[lang].searchPlaceholder;
  document.querySelector(".search-section button").textContent = translations[lang].searchBtn;
  document.querySelector("#type option[value='']").textContent = translations[lang].all;
  document.querySelector("#type option[value='hotel']").textContent = translations[lang].hotel;
  document.querySelector("#type option[value='hall']").textContent = translations[lang].hall;
  document.querySelector("#type option[value='stadium']").textContent = translations[lang].stadium;
  document.getElementById("modalTitle").textContent = translations[lang].modalTitle;
  bookingForm.querySelector("button").textContent = translations[lang].confirmBtn;
  showFavoritesBtn.textContent = translations[lang].showFavOnly;
  document.querySelector(".footer p").childNodes[0].textContent = translations[lang].footer + " ";
  renderPlaces(showingFavoritesOnly ? filterFavorites() : filterResults(false));
}

// تشغيل أولي
setLanguage(currentLang);
renderPlaces(places);


