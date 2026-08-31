const products = [
  { id: "spf", name: "Cloud Veil SPF 50", category: "Skin", subcategory: "Sun care", description: "Weightless daily sun fluid", finish: "Dewy", price: 1699, compareAt: 1899, rating: "4.9", reviews: "286", badge: "Bestseller", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85" },
  { id: "serum", name: "Dew Drop Barrier Serum", category: "Skin", subcategory: "Serums", description: "5% niacinamide + ceramides", finish: "Radiant", price: 1299, compareAt: 1499, rating: "4.8", reviews: "412", badge: "Skin favourite", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=700&q=85" },
  { id: "tint", name: "Soft Focus Skin Tint", category: "Makeup", subcategory: "Complexion", description: "Buildable, breathable coverage", finish: "Soft matte", price: 1499, compareAt: 1699, rating: "4.7", reviews: "328", badge: "New", image: "https://images.unsplash.com/photo-1631730486572-226d1c2b7f94?auto=format&fit=crop&w=700&q=85" },
  { id: "blush", name: "Moonlight Cream Blush", category: "Makeup", subcategory: "Cheeks", description: "Melt-in colour for cheeks", finish: "Dewy", price: 999, compareAt: 1099, rating: "4.8", reviews: "264", badge: "Fan favourite", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=700&q=85" },
  { id: "lip-oil", name: "Plump Theory Lip Oil", category: "Lips", subcategory: "Lips", description: "Glossy hydration, sheer tint", finish: "Radiant", price: 799, compareAt: 899, rating: "4.9", reviews: "508", badge: "Bestseller", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85" },
  { id: "lip-colour", name: "Velvet Matte Lip Colour", category: "Lips", subcategory: "Lips", description: "Comfort matte in 8 shades", finish: "Soft matte", price: 899, compareAt: 999, rating: "4.6", reviews: "197", badge: "8 shades", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=85&sat=-10" },
  { id: "cleanser", name: "Cloud Milk Cleanser", category: "Skin", subcategory: "Cleansers", description: "A milky reset for real skin", finish: "Dewy", price: 899, compareAt: 999, rating: "4.8", reviews: "173", badge: "Gentle", image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=85" },
  { id: "ritual-set", name: "The Everyday Ritual Set", category: "Sets", subcategory: "Sets", description: "Three essentials, one easy ritual", finish: "Radiant", price: 2999, compareAt: 3597, rating: "5.0", reviews: "88", badge: "Save 16%", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85" }
];

const state = {
  activeCategory: "All",
  finish: null,
  minPrice: null,
  maxPrice: null,
  sort: "featured",
  search: "",
  cart: loadStorage("aurae-cart", []),
  orders: loadStorage("aurae-orders", [
    { id: "AUR2194", date: "18 Aug 2024", status: "Delivered", total: 2398, address: "Mumbai, Maharashtra", products: ["Dew Drop Barrier Serum", "Plump Theory Lip Oil"], image: products[1].image },
    { id: "AUR1977", date: "02 Jul 2024", status: "Delivered", total: 1699, address: "Mumbai, Maharashtra", products: ["Cloud Veil SPF 50"], image: products[0].image }
  ]),
  delivery: { pin: "", text: "Enter your PIN code to see your estimated delivery date.", range: "" },
  payment: "upi",
  checkoutStep: 1,
  address: null,
  quizStep: 1,
  quizAnswers: []
};

function loadStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing */ }
}

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value).replace("₹", "₹");
}

function getProduct(id) { return products.find((product) => product.id === id); }

function getCartCount() { return state.cart.reduce((total, item) => total + item.qty, 0); }

function getCartSubtotal() { return state.cart.reduce((total, item) => { const product = getProduct(item.id); return total + (product ? product.price * item.qty : 0); }, 0); }

function getShipping(subtotal = getCartSubtotal()) { return subtotal > 0 && subtotal < 1499 ? 99 : 0; }

function renderProducts() {
  const grid = document.querySelector("#productGrid");
  if (!grid) return;
  let visible = products.filter((product) => {
    const matchesCategory = state.activeCategory === "All" || product.category === state.activeCategory;
    const matchesFinish = !state.finish || product.finish === state.finish;
    const matchesMin = state.minPrice === null || product.price >= state.minPrice;
    const matchesMax = state.maxPrice === null || product.price <= state.maxPrice;
    const query = state.search.trim().toLowerCase();
    const matchesSearch = !query || [product.name, product.category, product.subcategory, product.description].join(" ").toLowerCase().includes(query);
    return matchesCategory && matchesFinish && matchesMin && matchesMax && matchesSearch;
  });
  if (state.sort === "price-low") visible.sort((a, b) => a.price - b.price);
  if (state.sort === "price-high") visible.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") visible.sort((a, b) => Number(b.rating) - Number(a.rating));
  grid.innerHTML = visible.map(productCardHTML).join("");
  document.querySelector("#emptyProducts").hidden = visible.length > 0;
}

function productCardHTML(product) {
  return `<article class="product-card" data-product-id="${product.id}">
    <div class="product-visual"><span class="product-badge">${product.badge}</span><button class="wishlist-button" data-action="wishlist" aria-label="Save ${product.name}">♡</button><img src="${product.image}" alt="${product.name}" loading="lazy" /><button class="product-add" data-action="quick-add" data-product-id="${product.id}">Add to bag <span>＋</span></button></div>
    <div class="product-info"><span class="product-category">${product.subcategory}</span><h3>${product.name}</h3><p class="product-description">${product.description}</p><div class="product-meta"><span class="product-rating">★★★★★ <span>${product.rating} (${product.reviews})</span></span><span class="product-price"><del>${formatINR(product.compareAt)}</del>${formatINR(product.price)}</span></div></div>
  </article>`;
}

function renderCart() {
  const count = getCartCount();
  const subtotal = getCartSubtotal();
  const shipping = getShipping(subtotal);
  document.querySelector("#bagCount").textContent = count;
  document.querySelector("#drawerBagCount").textContent = `(${count})`;
  document.querySelector("#cartSubtotal").textContent = formatINR(subtotal);
  document.querySelector("#cartTotal").textContent = formatINR(subtotal + shipping);
  document.querySelector("#cartShipping").textContent = subtotal ? (shipping ? formatINR(shipping) : "Free") : "Calculated at checkout";
  const items = document.querySelector("#cartItems");
  items.innerHTML = state.cart.map((item) => {
    const product = getProduct(item.id);
    if (!product) return "";
    return `<div class="cart-row"><div class="cart-row-image"><img src="${product.image}" alt="${product.name}" /></div><div class="cart-row-detail"><span class="product-category">${product.subcategory}</span><h3>${product.name}</h3><p>${product.finish} finish</p><div class="qty-control"><button data-action="decrease-qty" data-product-id="${product.id}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-action="increase-qty" data-product-id="${product.id}" aria-label="Increase quantity">＋</button></div></div><div class="cart-row-right"><strong>${formatINR(product.price * item.qty)}</strong><button class="remove-button" data-action="remove-item" data-product-id="${product.id}">Remove</button></div></div>`;
  }).join("");
  const isEmpty = count === 0;
  document.querySelector("#cartEmpty").hidden = !isEmpty;
  document.querySelector("#cartSummary").hidden = isEmpty;
  const remaining = Math.max(1499 - subtotal, 0);
  document.querySelector("#shippingMeter").innerHTML = isEmpty ? "" : `<p>${remaining > 0 ? `You’re ${formatINR(remaining)} away from complimentary shipping.` : `You unlocked complimentary shipping. ✦`}</p><div class="meter-track"><span style="width:${Math.min(100, (subtotal / 1499) * 100)}%"></span></div>`;
}

function addToCart(id) {
  const existing = state.cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, qty: 1 });
  saveStorage("aurae-cart", state.cart);
  renderCart();
  showToast(`${getProduct(id).name} added to your bag`);
}

function adjustQty(id, amount) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
  saveStorage("aurae-cart", state.cart);
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((item) => item.id !== id);
  saveStorage("aurae-cart", state.cart);
  renderCart();
  showToast("Item removed from your bag");
}

function renderCheckoutSummary() {
  const subtotal = getCartSubtotal();
  const shipping = getShipping(subtotal);
  document.querySelector("#checkoutItems").innerHTML = state.cart.map((item) => {
    const product = getProduct(item.id);
    return `<div class="checkout-summary-item"><div class="checkout-summary-image"><img src="${product.image}" alt="${product.name}" /></div><div><strong>${product.name}</strong><span>Qty ${item.qty} · ${product.finish}</span></div><b>${formatINR(product.price * item.qty)}</b></div>`;
  }).join("");
  document.querySelector("#checkoutSubtotal").textContent = formatINR(subtotal);
  document.querySelector("#checkoutShipping").textContent = shipping ? formatINR(shipping) : "Free";
  document.querySelector("#checkoutTotal").textContent = formatINR(subtotal + shipping);
}

function openDrawer(id) {
  closeAllOverlays(false);
  const element = document.querySelector(`#${id}`);
  if (!element) return;
  element.classList.add("visible"); element.setAttribute("aria-hidden", "false");
  document.querySelector("#modalBackdrop").classList.add("visible");
  document.body.classList.add("no-scroll");
}

function closeAllOverlays(backdrop = true) {
  document.querySelectorAll(".side-drawer.visible, .modal-window.visible, .search-overlay.visible").forEach((element) => { element.classList.remove("visible"); element.setAttribute("aria-hidden", "true"); });
  if (backdrop) document.querySelector("#modalBackdrop").classList.remove("visible");
  document.body.classList.remove("no-scroll");
}

function openCart() { renderCart(); openDrawer("cartDrawer"); }

function openAccount(tab = "profile") { openDrawer("accountModal"); setAccountTab(tab); renderOrders(); }

function openCheckout() {
  if (!state.cart.length) { showToast("Your bag is empty — let’s find your next favourite"); return; }
  closeAllOverlays(false); renderCheckoutSummary(); setCheckoutStep(1); openDrawer("checkoutModal");
}

function setCheckoutStep(step) {
  state.checkoutStep = step;
  document.querySelectorAll(".progress-step").forEach((item) => { const number = Number(item.dataset.step); item.classList.toggle("active", number === step); item.classList.toggle("done", number < step); });
  document.querySelectorAll(".checkout-panel").forEach((panel) => panel.classList.remove("active"));
  document.querySelector(`#${step === 1 ? "deliveryStep" : step === 2 ? "paymentStep" : "confirmStep"}`).classList.add("active");
}

function setAccountTab(tab) {
  document.querySelectorAll(".account-tab").forEach((button) => button.classList.toggle("active", button.dataset.accountTab === tab));
  document.querySelectorAll(".account-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.accountPanel === tab));
}

function renderOrders() {
  const count = state.orders.length;
  document.querySelector("#orderNavCount").textContent = count;
  document.querySelector("#ordersCount").textContent = `${count} ${count === 1 ? "order" : "orders"}`;
  const html = state.orders.length ? state.orders.map((order) => `<div class="order-card"><div class="order-thumb"><img src="${order.image || products[0].image}" alt="${order.products[0]}" /></div><div><strong>Order #${order.id}</strong><span>${order.date} · ${order.products.join(" + ")}</span><span class="order-products">Delivering to ${order.address}</span></div><div class="order-right"><strong>${formatINR(order.total)}</strong><span class="order-status">${order.status}</span></div></div>`).join("") : `<div class="empty-products"><span>◌</span><h3>Your archive is quiet.</h3><p>Your future AURAÉ orders will live here.</p></div>`;
  document.querySelector("#ordersList").innerHTML = html;
  document.querySelector("#recentOrdersList").innerHTML = state.orders.slice(0, 2).map((order) => `<div class="recent-order"><div><strong>#${order.id}</strong><span>${order.date} · ${order.products.join(" + ")}</span></div><span class="order-status">${order.status}</span></div>`).join("");
}

function setDeliveryEstimate(pin) {
  state.delivery.pin = pin;
  const estimate = document.querySelector("#deliveryEstimate");
  if (!/^\d{6}$/.test(pin)) {
    state.delivery.range = "";
    state.delivery.text = "Enter your PIN code to see your estimated delivery date.";
    estimate.innerHTML = `<span class="estimate-icon">⌁</span><span>${state.delivery.text}</span>`;
    return;
  }
  const fast = /^[1-3]/.test(pin);
  const startDays = fast ? 3 : 4;
  const endDays = fast ? 5 : 7;
  const start = new Date(); start.setDate(start.getDate() + startDays);
  const end = new Date(); end.setDate(end.getDate() + endDays);
  const options = { day: "numeric", month: "short" };
  const startText = start.toLocaleDateString("en-IN", options);
  const endText = end.toLocaleDateString("en-IN", options);
  state.delivery.range = `${startText} – ${endText}`;
  state.delivery.text = `Arrives between ${state.delivery.range} · ${fast ? "Express route available" : "Standard delivery"}`;
  estimate.innerHTML = `<span class="estimate-icon">✦</span><span><strong>${state.delivery.text}</strong><br /><small>We deliver across India from our Bengaluru studio.</small></span>`;
}

function renderPaymentFields() {
  const fields = document.querySelector("#paymentFields");
  if (state.payment === "upi") fields.innerHTML = `<label>UPI ID<input id="upiId" placeholder="yourname@upi" required /></label><div class="payment-note" style="margin-top:10px">You’ll be redirected to your UPI app after placing the order.</div>`;
  if (state.payment === "card") fields.innerHTML = `<label>Card number<input id="cardNumber" inputmode="numeric" placeholder="1234 5678 9012 3456" required /></label><div class="form-row"><label>Expiry date<input placeholder="MM / YY" required /></label><label>CVV<input inputmode="numeric" placeholder="•••" required /></label></div><label style="margin-top:10px"><span class="checkbox-label"><input type="checkbox" checked /> Save card securely for next time</span></label>`;
  if (state.payment === "netbanking") fields.innerHTML = `<label>Choose your bank<select required><option value="">Select bank</option><option>HDFC Bank</option><option>ICICI Bank</option><option>State Bank of India</option><option>Axis Bank</option><option>Kotak Mahindra Bank</option><option>Other bank</option></select></label>`;
  if (state.payment === "cod") fields.innerHTML = `<div class="payment-note"><strong>Cash on delivery selected.</strong><br />A ₹49 handling fee will be added. Please keep the exact amount ready at delivery.</div>`;
}

function placeOrder() {
  const addressForm = document.querySelector("#deliveryForm");
  if (!state.address || !addressForm.checkValidity()) { setCheckoutStep(1); addressForm.reportValidity(); return; }
  const paymentFields = [...document.querySelectorAll("#paymentFields input[required], #paymentFields select[required]")];
  const invalidPaymentField = paymentFields.find((field) => !field.checkValidity());
  if (invalidPaymentField) { invalidPaymentField.reportValidity(); return; }
  const subtotal = getCartSubtotal();
  const handling = state.payment === "cod" ? 49 : 0;
  const shipping = getShipping(subtotal);
  const order = { id: `AUR${Math.floor(1000 + Math.random() * 8999)}`, date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), status: "Processing", total: subtotal + shipping + handling, address: `${state.address.city}, ${state.address.state}`, products: state.cart.map((item) => `${getProduct(item.id).name} ×${item.qty}`), image: getProduct(state.cart[0].id).image };
  state.orders.unshift(order); saveStorage("aurae-orders", state.orders);
  document.querySelector("#confirmationOrder").textContent = `#${order.id}`;
  document.querySelector("#confirmationDelivery").textContent = state.delivery.range || "3–7 business days";
  document.querySelector("#confirmationAddress").textContent = `${state.address.city}, ${state.address.state} ${state.address.pin}`;
  state.cart = []; saveStorage("aurae-cart", state.cart); renderCart(); renderOrders(); setCheckoutStep(3);
  showToast("Order confirmed — welcome to the glow club");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  document.querySelector("#toastMessage").textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 3200);
}

function openSearch() {
  closeAllOverlays(false);
  const overlay = document.querySelector("#searchOverlay"); overlay.classList.add("visible"); overlay.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll");
  document.querySelector("#searchInput").focus(); renderSearchResults("");
}

function renderSearchResults(query) {
  const term = query.trim().toLowerCase();
  const matches = term ? products.filter((product) => [product.name, product.category, product.description, product.finish].join(" ").toLowerCase().includes(term)) : products.slice(0, 4);
  document.querySelector("#searchResults").innerHTML = matches.length ? matches.map((product) => `<button class="search-result" data-action="quick-add" data-product-id="${product.id}"><div class="search-result-image"><img src="${product.image}" alt="${product.name}" /></div><strong>${product.name}</strong><span>${formatINR(product.price)} · Add to bag +</span></button>`).join("") : `<p class="search-empty">No glow found for “${query}”. Try “skin”, “lip” or “serum”.</p>`;
}

function openQuiz() { state.quizStep = 1; document.querySelectorAll(".quiz-step").forEach((step) => step.classList.toggle("active", step.dataset.quizStep === "1")); openDrawer("quizModal"); }

function quizNext() { state.quizStep += 1; document.querySelectorAll(".quiz-step").forEach((step) => step.classList.toggle("active", step.dataset.quizStep === String(state.quizStep))); }

function appendChat(text, response) {
  const log = document.querySelector("#chatLog");
  log.insertAdjacentHTML("beforeend", `<div class="chat-message user-message">${text}</div><div class="chat-message aura-message">${response}</div>`);
  log.scrollTop = log.scrollHeight;
}

function handleAction(actionElement) {
  const action = actionElement.dataset.action;
  const id = actionElement.dataset.productId;
  if (action === "quick-add") { addToCart(id); return; }
  if (action === "open-cart") { openCart(); return; }
  if (action === "open-account") { openAccount(); return; }
  if (action === "open-help") { openDrawer("helpDrawer"); return; }
  if (action === "open-checkout") { openCheckout(); return; }
  if (action === "close-drawers") { closeAllOverlays(); return; }
  if (action === "close-checkout") { closeAllOverlays(); return; }
  if (action === "close-search") { closeAllOverlays(); return; }
  if (action === "open-search") { openSearch(); return; }
  if (action === "increase-qty") { adjustQty(id, 1); return; }
  if (action === "decrease-qty") { adjustQty(id, -1); return; }
  if (action === "remove-item") { removeFromCart(id); return; }
  if (action === "open-quiz") { openQuiz(); return; }
  if (action === "quiz-next") { quizNext(); return; }
  if (action === "clear-filters") { state.finish = null; state.minPrice = null; state.maxPrice = null; document.querySelector("#minPrice").value = ""; document.querySelector("#maxPrice").value = ""; document.querySelectorAll(".finish-filter").forEach((button) => button.classList.remove("selected")); renderProducts(); return; }
  if (action === "open-filter") { document.querySelector("#filterPanel").classList.toggle("open"); return; }
  if (action === "filter-category") { setCategory(actionElement.dataset.category); document.querySelector("#shop").scrollIntoView({ behavior: "smooth" }); return; }
  if (action === "scroll-to-shop") { document.querySelector("#shop").scrollIntoView({ behavior: "smooth" }); return; }
  if (action === "wishlist") { actionElement.classList.toggle("loved"); actionElement.textContent = actionElement.classList.contains("loved") ? "♥" : "♡"; showToast(actionElement.classList.contains("loved") ? "Saved to your wishlist" : "Removed from wishlist"); return; }
  if (action === "checkout-back") { setCheckoutStep(1); return; }
  if (action === "place-order") { placeOrder(); return; }
  if (action === "open-account-orders") { closeAllOverlays(); openAccount("orders"); return; }
  if (action === "account-tab") { setAccountTab(actionElement.dataset.tab); return; }
  if (action === "edit-profile") { showToast("Profile editing is ready for your details"); return; }
  if (action === "save-preferences") { showToast("Your beauty preferences are saved"); return; }
  if (action === "add-address") { showToast("Address book is ready for your next address"); return; }
  if (action === "open-order-lookup") { appendChat("I need help tracking my order.", "Of course. Share your order number (for example, AUR2194) and I’ll look into it for you."); return; }
  if (action === "open-size-guide") { appendChat("Can you help me find my shade?", "Absolutely. Our Soft Focus Skin Tint is buildable and forgiving. Tell me your current foundation shade or undertone and I’ll narrow it down."); return; }
  if (action === "open-returns") { appendChat("How do returns work?", "You have 15 days from delivery to request a return for unused products. I can help you start that whenever you’re ready."); return; }
  if (action === "open-about") { showToast("Our story is coming to your inbox soon"); return; }
}

function setCategory(category) {
  state.activeCategory = category;
  document.querySelectorAll(".category-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.category === category));
  renderProducts();
}

document.addEventListener("click", (event) => {
  const actionElement = event.target.closest("[data-action]");
  if (actionElement) handleAction(actionElement);
  const category = event.target.closest(".category-tab");
  if (category) setCategory(category.dataset.category);
  const payment = event.target.closest(".payment-option");
  if (payment) { document.querySelectorAll(".payment-option").forEach((option) => option.classList.remove("active")); payment.classList.add("active"); state.payment = payment.dataset.payment; renderPaymentFields(); }
  const finish = event.target.closest(".finish-filter");
  if (finish) { const isSelected = finish.classList.toggle("selected"); document.querySelectorAll(".finish-filter").forEach((item) => { if (item !== finish) item.classList.remove("selected"); }); state.finish = isSelected ? finish.dataset.finish : null; renderProducts(); }
  const quizAnswer = event.target.closest("[data-quiz-answer]");
  if (quizAnswer) { quizAnswer.classList.add("selected"); setTimeout(() => { state.quizStep = 3; document.querySelectorAll(".quiz-step").forEach((step) => step.classList.toggle("active", step.dataset.quizStep === "3")); }, 160); }
  const accountTab = event.target.closest(".account-tab");
  if (accountTab) setAccountTab(accountTab.dataset.accountTab);
  const suggestion = event.target.closest(".chat-suggestions button");
  if (suggestion) { const text = suggestion.textContent; const replies = { "Where is my order?": "Share your order number and I’ll pull up the latest delivery update for you.", "How do returns work?": "You have 15 days from delivery to request a return for unused products. Easy, promise.", "Which serum is for me?": "Dew Drop Barrier Serum is our everyday pick for hydration, calm and a soft, lit-from-within finish." }; appendChat(text, replies[text]); }
});

document.querySelector("#sortSelect").addEventListener("change", (event) => { state.sort = event.target.value; renderProducts(); });
document.querySelector("#searchInput").addEventListener("input", (event) => renderSearchResults(event.target.value));
document.querySelector("#minPrice").addEventListener("input", (event) => { state.minPrice = event.target.value ? Number(event.target.value) : null; renderProducts(); });
document.querySelector("#maxPrice").addEventListener("input", (event) => { state.maxPrice = event.target.value ? Number(event.target.value) : null; renderProducts(); });
document.querySelector("#pinCode").addEventListener("input", (event) => setDeliveryEstimate(event.target.value.replace(/\D/g, "").slice(0, 6)));
document.querySelector("#deliveryForm").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); state.address = Object.fromEntries(data.entries()); state.address.pin = data.get("pin"); setCheckoutStep(2); renderPaymentFields(); });
document.querySelector("#newsletterForm").addEventListener("submit", (event) => { event.preventDefault(); const email = document.querySelector("#newsletterEmail").value; if (email) { showToast("You’re on the list — welcome to the glow club"); event.currentTarget.reset(); } });
document.querySelector("#chatForm").addEventListener("submit", (event) => { event.preventDefault(); const input = document.querySelector("#chatInput"); const text = input.value.trim(); if (!text) return; appendChat(text, "Thanks for reaching out. A member of our glow team will be with you shortly — usually under two minutes."); input.value = ""; });
document.querySelector(".announcement-close").addEventListener("click", (event) => event.currentTarget.closest(".announcement-bar").remove());
document.querySelector("#modalBackdrop").addEventListener("click", () => closeAllOverlays());
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeAllOverlays(); if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); } });
document.querySelector("[data-action='toggle-mobile-menu']").addEventListener("click", () => document.querySelector(".main-nav").classList.toggle("mobile-open"));

renderProducts(); renderCart(); renderOrders(); renderPaymentFields();
