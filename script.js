document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Cart ---------------- */
  const cart = {}; // { name: { price, qty } }

  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmptyMsg');
  const cartCountEl = document.getElementById('cart-count');
  const cartTotalEl = document.getElementById('cartTotal');

  function renderCart() {
    const names = Object.keys(cart);
    cartItemsEl.innerHTML = '';

    if (names.length === 0) {
      cartItemsEl.appendChild(cartEmptyMsg);
      cartEmptyMsg.classList.remove('d-none');
    } else {
      names.forEach(function (name) {
        const item = cart[name];
        const li = document.createElement('li');
        li.innerHTML =
          '<span class="cart-item-name">' + name + '<br><small class="text-muted">₹' + item.price + ' each</small></span>' +
          '<span class="cart-item-controls d-flex align-items-center gap-2">' +
            '<button type="button" class="btn btn-outline-secondary btn-sm" data-action="dec" data-name="' + name + '">-</button>' +
            '<span>' + item.qty + '</span>' +
            '<button type="button" class="btn btn-outline-secondary btn-sm" data-action="inc" data-name="' + name + '">+</button>' +
            '<button type="button" class="btn btn-outline-danger btn-sm" data-action="remove" data-name="' + name + '">&times;</button>' +
          '</span>';
        cartItemsEl.appendChild(li);
      });
    }

    let totalCount = 0;
    let totalPrice = 0;
    names.forEach(function (name) {
      totalCount += cart[name].qty;
      totalPrice += cart[name].qty * cart[name].price;
    });
    cartCountEl.textContent = totalCount;
    cartTotalEl.textContent = totalPrice;
  }

  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      if (!cart[name]) {
        cart[name] = { price: price, qty: 0 };
      }
      cart[name].qty += 1;
      renderCart();

      const original = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.classList.add('disabled');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('disabled');
      }, 900);
    });
  });

  cartItemsEl.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const name = btn.dataset.name;
    const action = btn.dataset.action;
    if (!cart[name]) return;

    if (action === 'inc') cart[name].qty += 1;
    if (action === 'dec') {
      cart[name].qty -= 1;
      if (cart[name].qty <= 0) delete cart[name];
    }
    if (action === 'remove') delete cart[name];

    renderCart();
  });

  document.getElementById('checkoutBtn').addEventListener('click', function () {
    if (Object.keys(cart).length === 0) {
      alert('Your cart is empty — add a dish first!');
      return;
    }

    const customerName = 'Customer';
    const orderLines = Object.keys(cart).map(function (name) {
      const item = cart[name];
      return '- ' + name + ' x' + item.qty + ' = ₹' + (item.price * item.qty);
    });

    const message =
      'Hello SpiceHot,%0A' +
      'I would like to place an order.%0A%0A' +
      'Customer: ' + customerName + '%0A' +
      'Items:%0A' + orderLines.join('%0A') + '%0A%0A' +
      'Total Amount: ₹' + cartTotalEl.textContent + '%0A' +
      'Please confirm the order and share the delivery time.';

    window.open('https://wa.me/919344465420?text=' + encodeURIComponent(decodeURIComponent(message)), '_blank', 'noopener');
  });

  renderCart();

  const cartOffcanvas = document.getElementById('cartOffcanvas');
  const mobileOrderButton = document.querySelector('.mobile-order-button');
  if (cartOffcanvas && mobileOrderButton) {
    cartOffcanvas.addEventListener('show.bs.offcanvas', function () {
      mobileOrderButton.classList.add('is-hidden');
    });

    cartOffcanvas.addEventListener('hidden.bs.offcanvas', function () {
      mobileOrderButton.classList.remove('is-hidden');
    });
  }

  /* ---------------- Menu search ---------------- */
  const searchInput = document.getElementById('menuSearch');
  const menuSearchForm = document.getElementById('menuSearchForm');
  const menuItems = document.querySelectorAll('.menu-item');
  const noResults = document.getElementById('noResults');

  if (menuSearchForm) {
    menuSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const term = searchInput.value.trim().toLowerCase();
      applyMenuFilter(activeFilter, term);
    });
  }

  let activeFilter = 'all';
  const filterButtons = document.querySelectorAll('.menu-filter');

  function applyMenuFilter(category, term) {
    let visibleCount = 0;
    menuItems.forEach(function (item) {
      const matchesSearch = (item.dataset.search || '').includes(term);
      const matchesCategory = category === 'all' || (item.dataset.category || '').split(' ').includes(category);
      const match = matchesSearch && matchesCategory;
      item.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    if (noResults) {
      noResults.classList.toggle('show', visibleCount === 0);
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.dataset.filter;
      filterButtons.forEach(function (item) { item.classList.toggle('is-active', item === button); });
      const term = searchInput ? searchInput.value.trim().toLowerCase() : '';
      applyMenuFilter(activeFilter, term);
    });
  });

  /* ---------------- Contact form ---------------- */
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      e.stopPropagation();
      contactForm.classList.add('was-validated');
      contactSuccess.classList.add('d-none');
      return;
    }
    contactForm.classList.remove('was-validated');
    contactSuccess.classList.remove('d-none');
    contactForm.reset();
    contactForm.classList.remove('was-validated');
  });

  /* ---------------- Newsletter subscribe (demo) ---------------- */
  document.getElementById('subscribeBtn').addEventListener('click', function () {
    const emailInput = document.getElementById('subscribeEmail');
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailInput.classList.add('is-invalid');
      return;
    }
    emailInput.classList.remove('is-invalid');
    emailInput.value = '';
    alert('Subscribed! Watch your inbox for SpiceHot offers.');
  });

  /* ---------------- Close mobile navbar after clicking a link ----------------
     Note: highlighting the active nav link on scroll is already handled by
     Bootstrap's built-in scrollspy (see data-bs-spy="scroll" on <body>), so we
     don't need to duplicate that logic here. */
  const navLinks = document.querySelectorAll('#navbarSupportedContent .nav-link');
  const navbarCollapseEl = document.getElementById('navbarSupportedContent');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navbarCollapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl).hide();
      }
    });
  });
});
