(function () {
  const USERS_KEY = 'spicehotUsers';
  const SESSION_KEY = 'spicehotCurrentUser';

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch (error) {
      return [];
    }
  }

  function setUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function setCurrentUser(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      name: user.name,
      email: user.email,
      userId: user.userId
    }));
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  function showAuthMessage(message, isError) {
    const box = document.querySelector('.auth-message');
    if (!box) return;
    box.textContent = message;
    box.classList.remove('auth-message--error', 'auth-message--success');
    box.classList.add(isError ? 'auth-message--error' : 'auth-message--success');
    box.hidden = false;
  }

  function hideAuthMessage() {
    const box = document.querySelector('.auth-message');
    if (!box) return;
    box.hidden = true;
    box.textContent = '';
  }

  function handleLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hideAuthMessage();

      const loginInput = document.getElementById('loginId');
      const passwordInput = document.getElementById('password');
      const identifier = (loginInput.value || '').trim();
      const password = (passwordInput.value || '').trim();

      if (!identifier || !password) {
        showAuthMessage('Please enter your email/user ID and password.', true);
        return;
      }

      const users = getUsers();
      const matchedUser = users.find(function (user) {
        return (
          (user.email && user.email.toLowerCase() === identifier.toLowerCase()) ||
          (user.userId && user.userId.toLowerCase() === identifier.toLowerCase())
        ) && user.password === password;
      });

      if (!matchedUser) {
        showAuthMessage('Invalid login details. Please check your email/user ID and password.', true);
        return;
      }

      setCurrentUser(matchedUser);
      showAuthMessage('Login successful! Redirecting...', false);
      window.setTimeout(function () {
        window.location.href = 'profile.html';
      }, 700);
    });
  }

  function handleSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      hideAuthMessage();

      const fullName = (document.getElementById('fullName').value || '').trim();
      const userId = (document.getElementById('userId').value || '').trim();
      const email = (document.getElementById('email').value || '').trim();
      const password = (document.getElementById('signupPassword').value || '').trim();
      const confirmPassword = (document.getElementById('confirmPassword').value || '').trim();

      if (!fullName || !userId || !email || !password || !confirmPassword) {
        showAuthMessage('Please fill in all the fields.', true);
        return;
      }

      if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters long.', true);
        return;
      }

      if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match.', true);
        return;
      }

      const users = getUsers();
      const exists = users.some(function (user) {
        return user.userId.toLowerCase() === userId.toLowerCase() || user.email.toLowerCase() === email.toLowerCase();
      });

      if (exists) {
        showAuthMessage('An account with this user ID or email already exists.', true);
        return;
      }

      const newUser = {
        name: fullName,
        userId: userId,
        email: email,
        password: password
      };

      users.push(newUser);
      setUsers(users);
      setCurrentUser(newUser);
      showAuthMessage('Account created successfully! Redirecting to login...', false);
      window.setTimeout(function () {
        window.location.href = 'login.html';
      }, 800);
    });
  }

  if (document.body.dataset.page === 'login') {
    handleLoginForm();
  }

  if (document.body.dataset.page === 'signup') {
    handleSignupForm();
  }

  const currentUser = getCurrentUser();
  const loginButton = document.querySelector('.header-login-btn');
  if (loginButton) {
    if (currentUser && currentUser.name) {
      const displayName = currentUser.name.split(' ')[0];
      loginButton.setAttribute('href', 'profile.html');
      loginButton.innerHTML = '<i class="fa-solid fa-user me-2" aria-hidden="true"></i>Hi, ' + displayName;
    } else {
      loginButton.setAttribute('href', 'login.html');
      loginButton.innerHTML = '<i class="fa-solid fa-user me-2" aria-hidden="true"></i>Login';
    }
  }

  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  }
})();
