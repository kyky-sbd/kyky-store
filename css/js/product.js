/**
 * PRODUCT.JS - KYKY STORE (FIXED VERSION)
 */

// 1. Fungsi Utama: Mengambil data dari memori browser
function loadAndDisplay() {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    displayProducts(savedProducts);
}

// 2. Fungsi untuk menampilkan barang di halaman utama
function displayProducts(data) {
    const container = document.getElementById('product-container');
    if (!container) return; 

    const isAdmin = localStorage.getItem('userRole') === 'admin';

    if (data.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-slate-400 font-bold italic">Barang belum ada nih... 🧐</p>
            </div>`;
        return;
    }

    const getIcon = (cat) => {
        if (!cat) return '✨';
        if (cat.includes('Elektronik')) return '📱';
        if (cat.includes('Fashion')) return '👕';
        if (cat.includes('Makanan')) return '🍲';
        return '✨';
    };

    container.innerHTML = data.map((p, i) => `
        <div class="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-50 hover:shadow-2xl transition-all duration-500 group">
            <div class="h-64 overflow-hidden rounded-[2.5rem] mb-6 relative bg-slate-100">
                <img src="${p.image}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                <span class="absolute top-4 left-4 bg-white/95 px-4 py-1.5 rounded-full text-[10px] font-extrabold text-blue-600 uppercase italic shadow-sm">
                    ${getIcon(p.category)} ${p.category || 'Umum'}
                </span>
            </div>
            
            <p class="text-[10px] text-blue-500 font-bold uppercase mb-2 flex items-center gap-1">
                📍 ${p.location || 'Batam, Kepri'}
            </p>
            
            <h4 class="font-bold text-slate-800 text-xl tracking-tight">${p.name}</h4>
            <p class="text-blue-600 font-black text-3xl mt-2 tracking-tighter">Rp ${parseInt(p.price || 0).toLocaleString('id-ID')}</p>
            
            <div class="mt-8 flex flex-col gap-2">
                <button onclick="addToCart(${i})" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all">
                    🛒 TAMBAH KERANJANG
                </button>
                
                <button onclick="beliWA('${p.name.replace(/'/g, "\\'")}', '${p.price}')" class="w-full bg-green-500 text-white py-4 rounded-2xl font-black hover:bg-green-600 transition shadow-lg shadow-green-100 active:scale-95">
                    BELI DI WHATSAPP
                </button>

                ${isAdmin ? `
                <button onclick="hapusProduk(${i})" class="mt-4 text-red-500 text-[10px] font-black uppercase text-center w-full py-2 bg-red-50 rounded-xl border border-red-100">
                    🗑️ Hapus Barang
                </button>` : ''}
            </div>
        </div>
    `).join('');
}

// 3. Fungsi Tambah ke Keranjang (Gunakan Index agar Pasti Masuk)
function addToCart(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const item = products[index];
    
    if (item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update angka di icon keranjang
        updateCartCount();
        
        // Notifikasi SweetAlert
        if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            Toast.fire({ icon: 'success', title: `🛒 ${item.name} ditambah!` });
        }
    }
}

// 4. Fungsi WhatsApp (Dibuat lebih kuat terhadap karakter spesial)
function beliWA(nama, harga) {
    const nomorWA = "6289523592687";
    const pesan = `Halo Kyky Store, saya mau beli *${nama}* seharga *Rp ${parseInt(harga).toLocaleString('id-ID')}*. Apakah stok masih ada?`;
    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');
}

// 5. Fungsi Update Angka Keranjang
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const el = document.getElementById('cart-count');
    if (el) el.innerText = cart.length;
}

// 6. Fungsi Hapus Barang (Hanya Admin)
function hapusProduk(index) {
    Swal.fire({
        title: 'Yakin dihapus?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            let p = JSON.parse(localStorage.getItem('products')) || [];
            p.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(p));
            loadAndDisplay(); 
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplay();
    updateCartCount();
});

// Search & Filter (Tetap sama seperti logika kamu)
function searchProduct() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(input));
    displayProducts(filtered);
}

function filterCategory(category, btn) {
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-lg');
        b.classList.add('bg-white', 'text-slate-500', 'border', 'border-slate-100');
    });
    
    btn.classList.add('bg-blue-600', 'text-white', 'shadow-lg');
    btn.classList.remove('bg-white', 'text-slate-500', 'border', 'border-slate-100');

    if (category === 'Semua') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}