import { state, saveCart } from "./state.js";
import { money, setText } from "./ui.js";

export function addToCart(product) {
  const found = state.cart.find((i) => i.id === product.id);
  if (found) found.qty += 1;
  else state.cart.push({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    qty: 1
  });

  saveCart();
  updateCartUI();
}

export function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  updateCartUI();
}

export function changeQty(id, delta) {
  const item = state.cart.find((i) => i.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) state.cart = state.cart.filter((i) => i.id !== id);

  saveCart();
  updateCartUI();
}

export function cartTotal() {
  return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function updateCartUI() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  setText("cartCount", String(count));
  setText("cartTotal", money(cartTotal()));

  const wrap = document.getElementById("cartItems");
  wrap.innerHTML = "";

  if (state.cart.length === 0) {
    wrap.innerHTML = `<p class="text-slate-500">Cart is empty.</p>`;
    return;
  }

  state.cart.forEach((i) => {
    const row = document.createElement("div");
    row.className = "flex gap-3 items-center border rounded-xl p-3";

    row.innerHTML = `
      <img class="w-14 h-14 object-contain bg-slate-100 rounded-lg p-2" src="${i.image}" alt="">
      <div class="flex-1">
        <p class="font-medium line-clamp-1">${i.title}</p>
        <p class="text-sm text-slate-600">${money(i.price)} × ${i.qty}</p>

        <div class="mt-2 flex gap-2">
          <button data-minus class="px-2 py-1 border rounded hover:bg-slate-50">-</button>
          <button data-plus class="px-2 py-1 border rounded hover:bg-slate-50">+</button>
          <button data-remove class="px-2 py-1 border rounded hover:bg-slate-50">Remove</button>
        </div>
      </div>
      <b>${money(i.price * i.qty)}</b>
    `;

    row.querySelector("[data-minus]").addEventListener("click", () => changeQty(i.id, -1));
    row.querySelector("[data-plus]").addEventListener("click", () => changeQty(i.id, +1));
    row.querySelector("[data-remove]").addEventListener("click", () => removeFromCart(i.id));

    wrap.appendChild(row);
  });
}