# PPVW-Solution

## 💻 Link Original PPVW 
Link PPVW: https://github.com/MRifkiPratama/PPVW/tree/main

## 🎯 Tujuan Proyek
### Memahami kerentanan:
- Menunjukkan bagaimana Autentikasi Tanpa API dapat dieksploitasi menggunakan alat manipulasi permintaan.
- Mensimulasikan serangan CSRF dan mengevaluasi dampaknya pada fungsionalitas aplikasi.
### Implementasi mitigasi:
- Menambahkan perlindungan CSRF ke titik akhir yang sensitif.
- Menyorot pentingnya menggunakan kunci API atau autentikasi berbasis token untuk keamanan API.

## 📊 Kesimpulan
### Temuan:
- Tidak ada Autentikasi API yang memungkinkan akses tidak sah ke titik akhir, yang mengarah ke eksploitasi kritis seperti transaksi tidak sah atau kebocoran data.
- Perlindungan CSRF secara efektif mencegah tindakan tidak sah yang dimulai oleh situs pihak ketiga atau pelaku jahat.
### Rekomendasi:
- Menggunakan autentikasi berbasis token (misalnya, JWT atau kunci API) untuk semua titik akhir API guna memastikan hanya pengguna yang sah yang dapat mengaksesnya.
- Menerapkan pembatasan kecepatan dan validasi input untuk lebih meningkatkan keamanan aplikasi.
Selalu pantau dan catat lalu lintas API untuk aktivitas yang mencurigakan.

## 🔧 Setup proyek
### **Instalasi**
1. Clone this repository:
   ```bash
   git clone https://github.com/sharifmasyhur/PPVW-Solution.git
   ```
2. Navigasi ke masing-masing folder frontend dan backend
   ```bash
   cd frontend
   cd backend
   ```
3. Eksekusi perintah `npm install` untuk dapat menjalankan program (di masing-masing folder)
   ```bash
   npm install
   ```
4. Memulai compiler
   backend
   ```bash
   node app.js
   ```
   frontend
   ```bash
   npm start
   ```
5. Program akan berjalan dan dapat digunakan.

## 🤝 Kontribusi
Jangan ragu untuk melakukan fork repositori, mengirimkan masalah, atau menyarankan perbaikan untuk menyempurnakan proyek ini.
