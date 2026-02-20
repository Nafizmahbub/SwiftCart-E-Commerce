const BASE = "https://fakestoreapi.com";

export async function getAllProducts() {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE}/products/categories`);
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export async function getProductsByCategory(category) {
  const res = await fetch(`${BASE}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Failed to load category products");
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to load product details");
  return res.json();
}