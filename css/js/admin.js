// Fungsi untuk menambah barang ke localStorage
function tambahProdukBaru(event) {
    event.preventDefault(); // Mencegah halaman reload saat submit form

    // Ambil data dari input form
    const name = document.getElementById('admin-nama').value;
    const price = document.getElementById('admin-harga').value;
    const category = document.getElementById('admin-kategori').value;
    const image = document.getElementById('admin-gambar').value || 'https://via.placeholder.com/300';
    const location = document.getElementById('admin-lokasi').value || 'Batam, Kepri';

    // Ambil data lama dari localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Masukkan barang baru ke dalam daftar
    const produkBaru = { name, price, category, image, location };
    products.push(produkBaru);

    // Simpan kembali ke localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Notifikasi sukses
    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `${name} sudah masuk ke toko.`,
        timer: 2000
    }).then(() => {
        window.location.href = 'index.html'; // Balik ke halaman utama setelah simpan
    });
}