<div align="center">
  <h1>🎓 E-Portfolio PPG Prajabatan 2026</h1>
  <p><i>Website E-Portfolio interaktif untuk memenuhi persyaratan Program Pendidikan Profesi Guru (PPG) Prajabatan 2026.</i></p>

  <a href="https://fannyf123.github.io/E_Portofolio_PPG_Prajabatan_2026"><strong>🌍 Lihat Live Demo »</strong></a>
  <br><br>

  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
</div>

---

## 📖 Tentang Proyek

Website ini dirancang secara khusus sebagai dokumentasi digital yang terstruktur sesuai dengan Rubrik E-Portfolio PPG Prajabatan. Portofolio ini menampilkan keseluruhan proses, pengalaman, artefak pembelajaran, hingga refleksi selama mengikuti program PPG.

## ✨ Fitur Unggulan

- 🎨 **Desain Modern & Profesional**: UI/UX yang memanjakan mata dilengkapi animasi interaktif dengan *Canvas Partikel*.
- 🌓 **Dark / Light Mode**: Mendukung pergantian tema gelap dan terang secara mulus.
- 📱 **Responsif Penuh**: Tampilan yang optimal di perangkat desktop, tablet, maupun mobile.
- 🔍 **Filter Artefak Cerdas**: Saring produk pembelajaran (RPP, Modul, Media, LKM, Asesmen) dengan mudah.
- 📊 **Tabel Penilaian Terintegrasi**: Menampilkan rekapitulasi nilai (Lampiran 7 & 8) per siklus secara rapi.
- 🖼️ **Galeri Interaktif & Lightbox**: Dokumentasi kegiatan divisualisasikan dengan elegan.
- 🚀 **Performa Tinggi**: Dibangun menggunakan Vanilla JS dan *build tool* Vite.

---

## 📋 Komponen Portofolio

Sesuai pedoman PPG, E-Portfolio ini memuat enam komponen utama:

| No | Komponen Utama | Penjelasan |
|:--:|:---|:---|
| **1** | 🧑‍🏫 **Profil Mahasiswa** | Narasi asal daerah, inspirasi menjadi guru, dan tujuan profesional ke depan. |
| **2** | 📂 **Artefak Produk** | Kumpulan RPP (3 siklus), Modul Ajar, Media Pembelajaran, LKM, dan Penilaian. |
| **3** | 🔍 **Analisis Artefak** | Deskripsi konteks, tujuan, kelebihan, kekurangan, serta kajian teori terkait. |
| **4** | 📝 **Lampiran Penilaian** | Instrumen Penilaian Penyusunan Perangkat & Praktik Mengajar (Lampiran 7 & 8). |
| **5** | 🌟 **Model Guru yang Dituju** | Visi, misi, kompetensi, dan karakter ideal seorang guru profesional. |
| **6** | 💡 **Refleksi & Filosofi** | Refleksi akhir PPL Terbimbing dan jabaran Filosofi Mengajar. |

---

## 🗂️ Struktur File

```
E-Portofolio_PPG_Prajabatan_2026/
├── index.html          # Halaman utama
├── css/
│   ├── index.css       # CSS entry point (imports all)
│   ├── style.css       # Design tokens & base styles
│   ├── base.css        # Reset & typography
│   ├── nav.css         # Navigation
│   ├── profil.css      # Profil section
│   ├── pendidikan.css  # Pendidikan section
│   ├── artefak.css     # Portfolio/artefak section
│   ├── skills.css      # Keahlian section
│   ├── model-guru.css  # Model guru section
│   ├── kontak.css      # Kontak section
│   ├── galeri.css      # Galeri section
│   ├── parallax.css    # Intro tear & parallax
│   ├── enhancements.css# Tambahan efek visual dan polesan UI
│   ├── smoothness.css  # Pengaturan transisi dan animasi halus
│   ├── eportfolio2.css # E-Portfolio 2 styles
│   ├── dark-mode.css   # Dark mode overrides
│   └── responsive.css  # Responsive breakpoints
├── js/
│   ├── main.js         # Entry point (imports all modules)
│   ├── particles.js    # Canvas particle animation
│   ├── scroll-experience.js    # Logika pengguliran (scroll) halaman
│   ├── section-transitions.js  # Efek transisi perpindahan antar bagian (section)
│   ├── artefak.js              # Logika fitur filter dan tampilan artefak
│   ├── profil-animation.js     # Animasi khusus bagian profil
│   ├── pendidikan-animation.js # Animasi khusus bagian pendidikan
│   ├── artefak-animation.js    # Animasi khusus bagian artefak
│   ├── model-guru-animation.js # Animasi khusus bagian model guru
│   ├── keahlian-animation.js   # Animasi khusus bagian keahlian (skills)
│   ├── galeri-animation.js     # Animasi khusus bagian galeri
│   ├── kontak-animation.js     # Animasi khusus bagian kontak
│   ├── footer-animation.js     # Animasi khusus bagian footer (kaki halaman)
│   ├── portfolio-chooser.js    # Logika interaksi pemilihan kategori portofolio
│   └── sertifikat-modal.js     # Logika pop-up (modal) penampil gambar sertifikat
├── vendor/
│   ├── gsap.min.js             # Library animasi GreenSock (terkompresi)
│   └── ScrollTrigger.min.js    # Plugin GSAP untuk pemicu animasi saat di-scroll
├── assets/
│   ├── img/            # Gambar dan media
│   └── pdf/            # Dokumen PDF
├── dist/               # Production build output
├── vite.config.js      # Vite configuration
├── package.json        # Identitas proyek, dependensi npm, & daftar script
└── README.md           # Dokumentasi dan informasi proyek (file ini)
```

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5 Semantik, CSS3 (Custom Properties, Glassmorphism).
- **Logika Interaktif:** Vanilla JavaScript (ES Modules).
- **Animasi:** GSAP, ScrollTrigger, dan HTML5 Canvas API.
- **Peralatan Pengembang:** Vite (Build Tool & Dev Server).
- **Deployment:** GitHub Actions & GitHub Pages.
- **Tipografi & Ikon:** Google Fonts (Inter, Outfit) & Font Awesome 6.

---

## 💻 Panduan Menjalankan Secara Lokal

Untuk menjalankan atau memodifikasi website ini di komputer Anda, ikuti langkah-langkah berikut:

1. **Clone repository ini**
   ```bash
   git clone https://github.com/fannyf123/E_Portofolio_PPG_Prajabatan_2026.git
   cd E_Portofolio_PPG_Prajabatan_2026
   ```
2. **Install dependensi**
   ```bash
   npm install
   ```
3. **Jalankan server pengembangan**
   ```bash
   npm run dev
   ```
   *Aplikasi akan berjalan di `http://127.0.0.1:5173/`*
4. **Build untuk Produksi** (opsional)
   ```bash
   npm run build
   npm run preview
   ```

---

## 🚀 Deployment Otomatis

Proyek ini telah dikonfigurasi menggunakan **GitHub Actions**. Setiap kali ada perubahan (*push*) pada *branch* `main`, sistem akan secara otomatis melakukan proses *build* (`npm run build`) dan men-*deploy* *output* (`dist/`) langsung ke GitHub Pages.

---

## 👩‍🏫 Profil Penulis

* **Nama:** Fanny Fatchurrahman
* **Bidang Studi:** Teknik Pemesinan
* **Program:** PPG Prajabatan 2026
* **Institusi:** Universitas Sarjanawiyata Tamansiswa (UST)

<br>

<div align="center">
  <i>Copyright &copy; 2026 Fanny Fatchurrahman. All rights reserved.</i>
</div>
