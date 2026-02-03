//  copy จาก navbar มา backup ไว้ (เป็นไฟลื navbar เดิม)
// web/js/navbar.js

document.addEventListener('DOMContentLoaded', () => {

  const user = JSON.parse(localStorage.getItem('user'));

  let userMenuHTML = '';
  let productLink = '/login'; // default

  // ===================== ROLE BASE PRODUCT LINK =====================
  // กำหนด part products page ตาม role 
  if (user) {
    if (user.role === 'customer') {
      productLink = '/productcust';
    } else if (user.role === 'sales') {
      productLink = '/productsale';
    } else if (user.role === 'admin') {
      productLink = '/productsale'; 
    }
  }

  // ===================== NOT LOGIN =====================
  if (!user) {
    userMenuHTML = `
      <li class="nav-item">
        <a class="nav-link" href="/login">
          <i class="bi bi-person-circle"></i>
        </a>
      </li>
    `;
  }

  // ===================== LOGIN =====================
  else {
    userMenuHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle d-flex align-items-center"
          href="#" role="button" data-bs-toggle="dropdown">
          <span class="me-1 fw-semibold">${user.username}</span>
          <i class="bi bi-person-circle"></i>
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button class="dropdown-item" id="logoutBtn">
              <i class="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </li>
        </ul>
      </li>
    `;
  }

  const navbarHTML = `
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <a class="navbar-brand fw-bold" href="/mystore">My Store</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="/mystore">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="${productLink}">Products</a></li>
            <li class="nav-item"><a class="nav-link" href="/contact">Contact</a></li>
            <li class="nav-item">
              <a class="nav-link" href="/cart"><i class="bi bi-cart"></i></a>
            </li>
            ${userMenuHTML}
          </ul>
        </div>
      </div>
    </nav>
  `;

  document.getElementById('navbar-container').innerHTML = navbarHTML;

  // ===================== Logout =====================
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      window.location.href = '/login';
    });
  }
});


async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST'
  });
  window.location.href = '/login';
}
