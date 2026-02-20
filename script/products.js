import { getAllProducts, getCategories, getProductsByCategory } from "./api.js";
import { state } from "./state.js";
import { renderCategories, renderProducts } from "./ui.js";
import { addToCart, updateCartUI } from "./cart.js";

const statusEl = document.getElementById("status");

function setStatus(msg) {
  statusEl.textContent = msg;
}

async function init() {
  try {
    setStatus("Loading categories...");
    state.categories = await getCategories();
    state.selectedCategory = "all";
    renderCategories(handleSelectCategory);

    setStatus("Loading products...");
    state.products = await getAllProducts();

    renderProducts(state.products, {
      onDetails: () => {},
      onAddToCart: addToCart
    });

    updateCartUI();
    setStatus("");
  } catch (err) {
    setStatus(err?.message || "Something went wrong!");
  }
}

async function handleSelectCategory(category) {
  state.selectedCategory = category;
  renderCategories(handleSelectCategory);

  try {
    setStatus("Loading products...");
    if (category === "all") {
      renderProducts(state.products, { onDetails: () => {}, onAddToCart: addToCart });
      setStatus("");
      return;
    }
    const list = await getProductsByCategory(category);
    renderProducts(list, { onDetails: () => {}, onAddToCart: addToCart });
    setStatus("");
  } catch (err) {
    setStatus(err?.message || "Failed to load category!");
  }
}

init();