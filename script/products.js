import { getAllProducts, getCategories, getProductsByCategory, getProductById } from "./api.js";
import { state } from "./state.js";
import { renderCategories, renderProducts, openModal, closeModal, money } from "./ui.js";
import { addToCart, updateCartUI } from "./cart.js";

// Modal close events
const modalCloseBtn = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") closeModal();
  });
}

const statusEl = document.getElementById("status");

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

/* ---------- INIT ---------- */
async function init() {
  try {
    setStatus("Loading categories...");
    state.categories = await getCategories();
    state.selectedCategory = "all";
    renderCategories(handleSelectCategory);

    setStatus("Loading products...");
    state.products = await getAllProducts();

    renderProducts(state.products, {
      onDetails: showDetails,
      onAddToCart: addToCart
    });

    updateCartUI();
    setStatus("");
  } catch (err) {
    setStatus(err?.message || "Something went wrong!");
  }
}

/* ---------- CATEGORY FILTER ---------- */
async function handleSelectCategory(category) {
  state.selectedCategory = category;
  renderCategories(handleSelectCategory);

  try {
    setStatus("Loading products...");

    if (category === "all") {
      renderProducts(state.products, {
        onDetails: showDetails,
        onAddToCart: addToCart
      });
      setStatus("");
      return;
    }

    const list = await getProductsByCategory(category);

    renderProducts(list, {
      onDetails: showDetails,
      onAddToCart: addToCart
    });

    setStatus("");
  } catch (err) {
    setStatus(err?.message || "Failed to load category!");
  }
}

/* ---------- PRODUCT DETAILS MODAL ---------- */
async function showDetails(id) {
  try {
    const p = await getProductById(id);

    openModal(`
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-slate-100 rounded-2xl p-4 flex items-center justify-center">
          <img class="max-h-80 object-contain" src="${p.image}" alt="">
        </div>

        <div>
          <span class="inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full capitalize">
            ${p.category}
          </span>

          <h3 class="mt-3 text-2xl font-bold">${p.title}</h3>

          <div class="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <span class="text-yellow-500">⭐ ${p.rating?.rate ?? "-"}</span>
            <span>(${p.rating?.count ?? 0})</span>
          </div>

          <p class="mt-4 text-slate-600">${p.description}</p>

          <div class="mt-5 flex items-center justify-between">
            <b class="text-2xl">${money(p.price)}</b>
          </div>

          <button id="modalAdd"
            class="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Add to Cart
          </button>
        </div>
      </div>
    `);

    const modalAdd = document.getElementById("modalAdd");

    if (modalAdd) {
      modalAdd.addEventListener("click", () => {
        addToCart(p);
        closeModal();
      });
    }

  } catch (e) {
    alert("Failed to load details!");
  }
}

init();