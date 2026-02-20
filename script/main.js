import { getAllProducts, getCategories, getProductsByCategory, getProductById } from "./api.js";
import { state } from "./state.js";
import { renderCategories, renderProducts, renderTrending, openModal, closeModal, setText, money } from "./ui.js";
import { addToCart, updateCartUI } from "./cart.js";

const statusEl = document.getElementById("status");

// Mobile menu toggle
document.getElementById("mobileMenuBtn").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("hidden");
});

// Modal events
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop") closeModal();
});

// Cart drawer events
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "cartBackdrop") closeCart();
});

function openCart() {
  document.getElementById("cartBackdrop").classList.remove("hidden");
}
function closeCart() {
  document.getElementById("cartBackdrop").classList.add("hidden");
}

function setStatus(msg) {
  statusEl.textContent = msg;
}

async function init() {
  try {
    setStatus("Loading categories...");
    state.categories = await getCategories();

    renderCategories(handleSelectCategory);

    setStatus("Loading products...");
    state.products = await getAllProducts();

    // Trending: top 3 rated
    const trending = [...state.products]
      .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
      .slice(0, 3);

    renderTrending(trending, { onDetails: showDetails, onAddToCart: addToCart });
    renderProducts(state.products, { onDetails: showDetails, onAddToCart: addToCart });

    updateCartUI();
    setStatus("");
  } catch (err) {
    setStatus(err?.message || "Something went wrong!");
  }
}

async function handleSelectCategory(category) {
  state.selectedCategory = category;
  renderCategories(handleSelectCategory); // refresh active button

  try {
    setStatus("Loading products...");
    if (category === "all") {
      renderProducts(state.products, { onDetails: showDetails, onAddToCart: addToCart });
      setStatus("");
      return;
    }

    const list = await getProductsByCategory(category);
    renderProducts(list, { onDetails: showDetails, onAddToCart: addToCart });
    setStatus("");
  } catch (err) {
    setStatus(err?.message || "Failed to load category!");
  }
}

async function showDetails(id) {
  try {
    setText("trendingStatus", "Loading details...");
    const p = await getProductById(id);

    openModal(`
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-100 rounded-2xl p-4 flex items-center justify-center">
          <img class="max-h-80 object-contain" src="${p.image}" alt="">
        </div>

        <div>
          <span class="inline-block text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full capitalize">
            ${p.category}
          </span>

          <h3 class="mt-3 text-2xl font-bold">${p.title}</h3>

          <div class="mt-3 flex items-center justify-between text-sm">
            <span class="text-yellow-500">⭐ ${p.rating?.rate ?? "-"} </span>
            <span class="text-gray-500">(${p.rating?.count ?? 0})</span>
          </div>

          <p class="mt-4 text-slate-600">${p.description}</p>

          <div class="mt-5 flex items-center justify-between">
            <b class="text-2xl">${money(p.price)}</b>
          </div>

          <div class="mt-6 flex gap-2">
            <button id="modalAdd" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Add to Cart
            </button>
            <button id="modalBuy" class="flex-1 px-4 py-2 border rounded-lg hover:bg-slate-50 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `);

    document.getElementById("modalAdd").addEventListener("click", () => {
      addToCart(p);
      closeModal();
      openCart();
    });

    document.getElementById("modalBuy").addEventListener("click", () => {
      addToCart(p);
      closeModal();
      openCart();
    });

    setText("trendingStatus", "");
  } catch (e) {
    setText("trendingStatus", "");
    alert("Failed to load details!");
  }
}

init();