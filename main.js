// بيانات الأماكن
const places = [
  {
    id: 1,
    type: "hotel",
    city: "القاهرة",
    name: "فندق النيل",
    price: 120,
    rating: 4,
    img: "R (1).jpeg",
  },
  {
    id: 2,
    type: "hall",
    city: "الإسكندرية",
    name: "قاعة العروس",
    price: 200,
    rating: 5,
    img: "OIP (22).jpeg",
  },
  {
    id: 3,
    type: "stadium",
    city: "الجيزة",
    name: "ملعب الجيزة",
    price: 80,
    rating: 3,
    img: "R (2).jpeg",
  },
  {
    id: 4,
    type: "hotel",
    city: "أسوان",
    name: "فندق النوبة",
    price: 150,
    rating: 4,
    img: "Nubian-Hotels-Aswan-3.jpg",
  },
  {
    id: 5,
    type: "hall",
    city: "المنصورة",
    name: "قاعة النخيل",
    price: 180,
    rating: 4,
    img: "R (3).jpeg",
  },
  {
    id: 6,
    type: "stadium",
    city: "سوهاج",
    name: "ملعب سوهاج",
    price: 90,
    rating: 3,
    img: "R (4).jpeg",
  },
  {
    id: 7,
    type: "hotel",
    city: "الإسكندرية",
    name: "فندق البحر",
    price: 130,
    rating: 5,
    img: "R (5).jpeg",
  },
  {
    id: 8,
    type: "hall",
    city: "القاهرة",
    name: "قاعة الرحاب",
    price: 220,
    rating: 5,
    img: "preview_k-aa-lrh-b_SFxpP1KO.jpeg",
  },
  {
    id: 9,
    type: "stadium",
    city: "الأسكندرية",
    name: "ملعب النجوم",
    price: 75,
    rating: 4,
    img: "GD-EG-Alex-Stade002.JPG",
  },
  {
    id: 10,
    type: "hotel",
    city: "الغردقة",
    name: "فندق المرجان",
    price: 140,
    rating: 5,
    img: "R (6).jpeg",
  },
];

// المفضلة
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let showingFavoritesOnly = false;
let selectedPlaceName = null;

// عناصر DOM
const resultsContainer = document.getElementById("results");
const bookingModal = document.getElementById("bookingModal");
const closeModalBtn = bookingModal.querySelector(".close");
const bookingForm = document.getElementById("bookingForm");
const darkModeBtn = document.getElementById("darkModeBtn");
const showFavoritesBtn = document.getElementById("showFavoritesBtn");
const uploadInput = document.getElementById("uploadInput");

// عرض الكروت
// عرض الكروت
function renderPlaces(list) {
  resultsContainer.innerHTML = "";
  if (list.length === 0) {
    resultsContainer.innerHTML =
      '<p style="grid-column:1/-1;text-align:center;">لا توجد نتائج</p>';
    return;
  }
  list.forEach((place) => {
    const isFav = favorites.includes(place.id);
    const card = document.createElement("article");
    card.className = "card";
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
  <img src="${place.img}" alt="صورة ${place.name}" loading="lazy" />
  <div class="card-body">
    <h3>${place.name}</h3>
    <p>المدينة: ${place.city}</p>
    <p>السعر: $${place.price} / يوم</p>
    <p class="details-description">وصف مختصر لهذا المكان يوضح مميزاته في سطرين فقط.</p>
    <p class="rating">${"⭐".repeat(place.rating)}${"☆".repeat(5 - place.rating)}</p>
    <button class="btn fav-btn">${isFav ? "إزالة من المفضلة" : "أضف للمفضلة"}</button>
    <button class="btn book-btn" style="margin-top:10px; background: #00b894;">احجز الآن</button>
  </div>
`;


    // فتح صفحة التفاصيل عند الضغط على الكارد نفسه (مع استثناء الأزرار)
    card.addEventListener("click", (e) => {
      if (e.target.closest("button")) return; // لو ضغط على زر جوة الكارد ما يفتحش صفحة
      window.location.href = `${place.id}.html`;
    });

    // زر المفضلة
    card.querySelector(".fav-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(place.id);
      renderPlaces(showingFavoritesOnly ? filterFavorites() : filterResults(false));
    });

    // زر الحجز
    card.querySelector(".book-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openBookingModal(place.name);
    });

    resultsContainer.appendChild(card);
  });
}


// فلترة النتائج
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
    showFavoritesBtn.textContent = "عرض المفضلة فقط";
    renderPlaces(filtered);
  }
  return filtered;
}

// المفضلة
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
  if (showingFavoritesOnly) {
    showFavoritesBtn.textContent = "عرض الكل";
    renderPlaces(filterFavorites());
  } else {
    showFavoritesBtn.textContent = "عرض المفضلة فقط";
    renderPlaces(filterResults(false));
  }
});

// مودال الحجز
function openBookingModal(placeName) {
  selectedPlaceName = placeName;
  bookingModal.classList.add("show");
  bookingModal.setAttribute("aria-hidden", "false");
}
function closeBookingModal() {
  bookingModal.classList.remove("show");
  bookingModal.setAttribute("aria-hidden", "true");
  bookingForm.reset();
}
closeModalBtn.addEventListener("click", closeBookingModal);
bookingModal.addEventListener("click", (e) => {
  if (e.target === bookingModal) closeBookingModal();
});
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(`تم تأكيد الحجز في ${selectedPlaceName}، شكراً لك!`);
  closeBookingModal();
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
darkModeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  setDarkMode(!isDark);
});
if (localStorage.getItem("darkMode") === "true") {
  setDarkMode(true);
}

// رفع صورة مكان جديد
uploadInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (ev) {
      const newPlace = {
        id: Date.now(),
        type: "hotel",
        city: "موقع المستخدم",
        name: "مكان جديد مرفوع",
        price: 100,
        rating: 4,
        img: ev.target.result,
      };
      places.push(newPlace);
      renderPlaces(
        showingFavoritesOnly ? filterFavorites() : filterResults(false)
      );
    };
    reader.readAsDataURL(file);
  });
  e.target.value = "";
});

// تشغيل أولي
renderPlaces(places);
