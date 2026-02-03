// 1. Fungsi Utama: Menampilkan barang yang ada di keranjang
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('total-harga');
    
    // Pastikan container ada di HTML
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <p class="text-slate-400 font-bold italic">Keranjangmu masih kosong nih... 🛒</p>
                <a href="index.html" class="text-blue-600 font-black underline mt-4 block uppercase text-xs">Yuk Belanja Sekarang!</a>
            </div>`;
        if (totalEl) totalEl.innerText = "Rp 0";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const harga = parseInt(item.price || 0);
        total += harga;
        return `
            <div class="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm mb-4 animate-link">
                <div class="flex items-center gap-4">
                    <img src="${item.image}" class="w-20 h-20 rounded-2xl object-cover shadow-sm">
                    <div>
                        <h4 class="font-bold text-slate-800 leading-tight">${item.name}</h4>
                        <p class="text-[10px] text-blue-500 font-bold uppercase tracking-wider mt-1">📍 ${item.location || 'Batam'}</p>
                        <p class="text-blue-600 font-black text-lg">Rp ${harga.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <button onclick="hapusItem(${index})" class="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    🗑️
                </button>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = "Rp " + total.toLocaleString('id-ID');
}

// 2. Fungsi Hapus Item dari Keranjang
function hapusItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    renderCart(); // Gambar ulang tampilan
    
    // Update angka di navbar secara real-time
    const countEl = document.getElementById('cart-count');
    if(countEl) countEl.innerText = cart.length;
}

// 3. Fungsi Kirim Pesanan ke WhatsApp
function checkoutWA() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert('Keranjang kosong!');

    let pesan = "*PESANAN BARU - KYKY STORE*%0A%0A";
    let total = 0;
    
    cart.forEach((item, i) => {
        pesan += `${i+1}. *${item.name}* (Rp ${parseInt(item.price).toLocaleString('id-ID')})%0A`;
        total += parseInt(item.price);
    });
    
    pesan += `%0A*Total Harga: Rp ${total.toLocaleString('id-ID')}*%0A%0A_Mohon segera diproses ya!_`;
    
    const url = `https://wa.me/6289523592687?text=${pesan}`;
    window.open(url, '_blank');
}

// 4. Jalankan saat halaman dibuka
document.addEventListener('DOMContentLoaded', renderCart);