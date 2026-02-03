function checkAuth() {
    const role = localStorage.getItem('userRole');
    const path = window.location.pathname;

    // Jika belum login dan mencoba masuk ke halaman selain login
    if (!role && !path.includes('login.html')) {
        window.location.href = 'login.html';
    }

    // Jika bukan admin tapi mencoba masuk ke dashboard admin
    if (path.includes('dashboard-admin.html') && role !== 'admin') {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);