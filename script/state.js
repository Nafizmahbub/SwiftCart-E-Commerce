export const state = {
  categories: [],
  products: [],
  selectedCategory: "all",
  cart: JSON.parse(localStorage.getItem("swiftcart_cart") || "[]"),
};

export function saveCart() {
  localStorage.setItem("swiftcart_cart", JSON.stringify(state.cart));
}