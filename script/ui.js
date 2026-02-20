import { state } from "./state.js";

export function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

export function renderCategories(onSelect) {
  const bar = document.getElementById("categoryBar");
  bar.innerHTML = "";

  const allBtn = makeCatBtn("all", "All");
  bar.appendChild(allBtn);

  state.categories.forEach((c) => bar.appendChild(makeCatBtn(c, c)));

  function makeCatBtn(value, label) {
    const btn = document.createElement("button");
    btn.className = catBtnClass(value === state.selectedCategory);
    btn.textContent = label;
    btn.addEventListener("click", () => onSelect(value));
    return btn;
  }
}

function catBtnClass(active) {
  return `px-4 py-2 rounded-full text-sm font-medium transition capitalize
    ${active
      ? "bg-indigo-600 text-white shadow"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`;
}

export function renderTrending(products, { onDetails, onAddToCart }) {
  const grid = document.getElementById("trendingGrid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-sm hover:shadow-md transition p-4";

    card.innerHTML = `
      <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
        <img src="${p.image}" class="h-full object-contain p-4" alt="">
      </div>

      <span class="mt-3 inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full capitalize">
        ${escapeHtml(p.category)}
      </span>

      <h3 class="mt-2 font-semibold line-clamp-1 text-gray-800">${escapeHtml(p.title)}</h3>

      <div class="flex items-center justify-between mt-2 text-sm">
        <span class="text-yellow-500">⭐ ${p.rating?.rate ?? "-"}</span>
        <span class="text-gray-500">(${p.rating?.count ?? 0})</span>
      </div>

      <div class="mt-2 font-bold text-lg">${money(p.price)}</div>

      <div class="mt-4 flex gap-2">
        <button data-details class="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-100 transition">Details</button>
        <button data-add class="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm hover:bg-indigo-700 transition">Add</button>
      </div>
    `;

    card.querySelector("[data-details]").addEventListener("click", () => onDetails(p.id));
    card.querySelector("[data-add]").addEventListener("click", () => onAddToCart(p));

    grid.appendChild(card);
  });
}

export function renderProducts(products, { onDetails, onAddToCart }) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col";

    card.innerHTML = `
      <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
        <img src="${p.image}" class="h-full object-contain p-4" alt="${escapeHtml(p.title)}">
      </div>

      <span class="mt-3 inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full capitalize">
        ${escapeHtml(p.category)}
      </span>

      <h3 class="mt-2 font-semibold line-clamp-2 text-gray-800">
        ${escapeHtml(p.title)}
      </h3>

      <div class="flex items-center justify-between mt-2 text-sm">
        <span class="text-yellow-500">⭐ ${p.rating?.rate ?? "-"}</span>
        <span class="text-gray-500">(${p.rating?.count ?? 0})</span>
      </div>

      <div class="mt-2 font-bold text-lg">${money(p.price)}</div>

      <div class="mt-4 flex gap-2">
        <button data-details class="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-100 transition">Details</button>
        <button data-add class="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm hover:bg-indigo-700 transition">Add</button>
      </div>
    `;

    card.querySelector("[data-details]").addEventListener("click", () => onDetails(p.id));
    card.querySelector("[data-add]").addEventListener("click", () => onAddToCart(p));

    grid.appendChild(card);
  });
}

export function openModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modalBackdrop").classList.remove("hidden");
}

export function closeModal() {
  document.getElementById("modalBackdrop").classList.add("hidden");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}