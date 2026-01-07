# Gaming Gear Shop 🎮

Aplikasi mobile e-commerce untuk penjualan peralatan gaming, dibangun menggunakan **React Native (Expo)** dan **Supabase**.

## 📱 Fitur Utama

- **Autentikasi Pengguna**: Login & Register dengan aman.
- **Katalog Produk**: Menampilkan daftar produk gaming gear dengan filter kategori.
- **Detail Produk**: Informasi lengkap produk, harga, dan stok.
- **Keranjang Belanja**: Tambah, hapus, dan update jumlah item.
- **Favorit**: Simpan produk ke daftar keinginan.
- **Checkout & Order**: Proses pembelian lengkap dengan pilihan pengiriman dan metode pembayaran.
- **Riwayat Pesanan**: Lihat status dan detail transaksi masa lalu.
- **Manajemen Profil**: Edit informasi pengguna dan alamat pengiriman.
- **Admin Panel**: (Khusus Admin) Tambah, edit, dan hapus produk.
- **Mode Gelap/Terang**: Dukungan tema sesuai preferensi sistem atau user.

## 🛠 Teknologi yang Digunakan

- **Frontend**: React Native, Expo Router.
- **State Management**: Zustand.
- **Backend & Database**: Supabase (PostgreSQL).
- **Storage**: Supabase Storage (untuk gambar produk).
- **Styling**: React Native StyleSheet, Themed Components.

## 🚀 Cara Menjalankan Project

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**
   Pastikan file `.env` atau konfigurasi Supabase sudah terpasang di `lib/supabase.ts`.

3. **Jalankan Aplikasi**
   ```bash
   npx expo start
   ```

## 📂 Struktur Project

- `app/`: Halaman dan routing (Expo Router).
- `components/`: Komponen UI reusable.
- `store/`: State management (Zustand) dan logika bisnis.
- `lib/`: Konfigurasi Supabase dan utilitas lain.
- `constants/`: Konstanta aplikasi (Warna, dll).
- `assets/`: Gambar dan font statis.
