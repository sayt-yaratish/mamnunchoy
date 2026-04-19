let cart = {};

// ➕ ➖ изменение количества
function changeQty(name, price, delta) {
    if (!cart[name]) {
        cart[name] = { qty: 0, price: price };
    }

    cart[name].qty += delta;

    if (cart[name].qty <= 0) {
        delete cart[name];
        document.getElementById("qty-" + name).innerText = 0;
    } else {
        document.getElementById("qty-" + name).innerText = cart[name].qty;
    }

    renderCart();
}

// 🧾 отображение корзины
function renderCart() {
    let text = "";
    let total = 0;

    let arr = [];

    for (let item in cart) {
        let q = cart[item].qty;
        let p = cart[item].price;

        total += q * p;
        arr.push(`${q} x ${item}`);
    }

    text = arr.join("\n");

    document.getElementById("cartText").innerText = text || "Пусто";
    document.getElementById("total").innerText =
        total.toLocaleString('ru-RU') + " сум";
}

// 🧹 очистка корзины
function clearCart() {
    cart = {};
    document.querySelectorAll("[id^='qty-']").forEach(el => el.innerText = 0);
    renderCart();
}

// 🚀 отправка заказа
function sendOrder() {

    if (Object.keys(cart).length === 0) {
        alert("Корзина пустая!");
        return;
    }

    let waiter = document.getElementById("waiter").value;
    let table = document.getElementById("table").value;

    let orderArr = [];
    let total = 0;

    for (let item in cart) {
        let q = cart[item].qty;
        let p = cart[item].price;

        total += q * p;
        orderArr.push(`${q} x ${item}`);
    }

    let orderText = orderArr.join("\n");
    let formattedTotal = total.toLocaleString('ru-RU');

    let message =
`НОВЫЙ ЗАКАЗ

${waiter}
Столик: ${table}
Заказ:
${orderText}

ИТОГО: ${formattedTotal} сум`;

    // ✅ TELEGRAM
    fetch("https://api.telegram.org/bot8442591217:AAEKM7snFpqnPahqIb92YxuZ7VHyRsf17fM/sendMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: "-1003827141763",
            text: message
        })
    });

    // ✅ GOOGLE SHEETS
    fetch("https://script.google.com/macros/s/AKfycby5c1WRgdWgBq_bE-2CMNU9jGOKf2ghjOl-MlsjNnGIhvMym7TQL0L8Pl53IgtpbCxifg/exec", {
        method: "POST",
        body: new URLSearchParams({
            waiter: waiter,
            table: table,
            order: orderText,
            total: total
        })
    });

// ❌ УБИРАЕМ ВСЕ ЖЕСТЫ ЗУМА (iPhone Safari)

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
});

document.addEventListener('gestureend', function (e) {
  e.preventDefault();
});

// ❌ УБИРАЕМ двойной тап
let lastTouchEnd = 0;

document.addEventListener('touchend', function (event) {
  let now = new Date().getTime();

  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }

  lastTouchEnd = now;
}, false);

// ❌ УБИРАЕМ pinch zoom (2 пальца)
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

    // ❌ ПОЛНОЕ ОТКЛЮЧЕНИЕ ЗУМА НА iPhone

document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());

// ❌ двойной тап
let lastTouchEnd = 0;

document.addEventListener('touchend', function (event) {
  let now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// ❌ pinch zoom (2 пальца)
document.addEventListener('touchmove', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });
