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
    alert('Thanks for your order! This demo does not process real payments yet.');
  });

  renderCart();

  /* ---------------- Menu search ---------------- */
  const searchInput = document.getElementById('menuSearch');
  const menuItems = document.querySelectorAll('.menu-item');
  const noResults = document.getElementById('noResults');

  document.getElementById('menuSearchForm').addEventListener('submit', function (e) {
    e.preventDefault();
  });

  searchInput.addEventListener('input', function () {
    const term = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;
    menuItems.forEach(function (item) {
      const match = item.dataset.search.includes(term);
      item.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });
    noResults.classList.toggle('show', visibleCount === 0);
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

  /* ---------------- Active nav link on scroll ---------------- */
  const navLinks = document.querySelectorAll('#navbarSupportedContent .nav-link');
  const sections = ['home', 'about', 'menu', 'contact'].map(function (id) {
    return document.getElementById(id);
  });

  function setActiveLink() {
    let currentId = sections[0].id;
    const scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      const linkId = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', linkId === currentId);
      link.closest('li').classList.toggle('active', linkId === currentId);
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* Close mobile navbar after clicking a link */
  const navbarCollapseEl = document.getElementById('navbarSupportedContent');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navbarCollapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapseEl).hide();
      }
    });
  });
});
