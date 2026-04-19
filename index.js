let cart = {};

function changeQty(name, price, delta) {
  if (!cart[name]) {
    cart[name] = { qty: 0, price: price };
  }

  cart[name].qty += delta;

  if (cart[name].qty <= 0) {
    delete cart[name];
  }

  document.getElementById("qty-" + name).innerText = cart[name]?.qty || 0;

  renderCart();
}

function renderCart() {
  let total = 0;
  let arr = [];

  for (let item in cart) {
    let q = cart[item].qty;
    let p = cart[item].price;

    total += q * p;
    arr.push(`${q} x ${item}`);
  }

  document.getElementById("cartText").innerText =
    arr.join("\n") || "Пусто";

  document.getElementById("total").innerText =
    total.toLocaleString('ru-RU') + " сум";
}

function clearCart() {
  cart = {};
  document.querySelectorAll("[id^='qty-']").forEach(el => el.innerText = 0);
  renderCart();
}

function sendOrder() {

  if (Object.keys(cart).length === 0) {
    alert("Корзина пустая!");
    return;
  }

  let waiter = document.getElementById("waiter").value;
  let table = document.getElementById("table").value;

  let total = 0;
  let arr = [];

  for (let item in cart) {
    let q = cart[item].qty;
    let p = cart[item].price;

    total += q * p;
    arr.push(`${q} x ${item}`);
  }

  let orderText = arr.join("\n");
  let formattedTotal = total.toLocaleString('ru-RU');

  let message =
`НОВЫЙ ЗАКАЗ

${waiter}
Столик: ${table}

${orderText}

ИТОГО: ${formattedTotal} сум`;

  fetch("https://api.telegram.org/bot8442591217:AAEKM7snFpqnPahqIb92YxuZ7VHyRsf17fM/sendMessage", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      chat_id: "-1003827141763",
      text: message
    })
  });

  fetch("https://script.google.com/macros/s/AKfycby5c1WRgdWgBq_bE-2CMNU9jGOKf2ghjOl-MlsjNnGIhvMym7TQL0L8Pl53IgtpbCxifg/exec", {
    method: "POST",
    body: new URLSearchParams({
      waiter,
      table,
      order: orderText,
      total
    })
  });

  alert("Заказ отправлен");
  clearCart();
}
