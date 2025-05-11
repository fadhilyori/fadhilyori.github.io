---
slug: cara-menambahkan-pengguna-ke-sudoers-di-debian-12
title: "Cara Menambahkan Pengguna ke Sudoers di Debian 12"
date: "2024-12-22"
tags: ["sudoers", "debian", "linux", "administration"]
categories: ["tutorial"]
author: "Fadhil Yori"
draft: false
hidemeta: false
summary: "Sebagai administrator sistem, mungkin kita perlu untuk memberikan hak administratif terbatas kepada pengguna lain atau mungkin kepada pengguna kita sendiri yang masih belum mendapatkan hak administratif tersebut. Dalam tulisan ini, kita akan mencoba beberapa cara untuk memberikan akses sudo kepada pengguna di Debian 12. Cara ini sebenarnya dapat diterapkan pada distribusi Linux lainnya, namun untuk contoh pada tulisan ini akan menggunakan Debian 12."
description: "Tulisan ini membahas langkah-langkah untuk memberikan akses sudo kepada pengguna di Debian 12, yang juga dapat diterapkan pada distribusi Linux lainnya."
canonicalURL: ""
disableShare: false
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowRssButtonInSectionTermList: true
cover:
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt: "Sudo"
    caption: "Photo by <a href=\"https://unsplash.com/@6heinz3r?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash\">Gabriel Heinzer</a> on <a href=\"https://unsplash.com/photos/text-4Mw7nkQDByk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash\">Unsplash</a>"
    relative: true
    hidden: false
---

Sebagai administrator sistem, mungkin kita perlu untuk memberikan hak administratif terbatas kepada pengguna lain, atau bahkan kepada akun pengguna kita sendiri yang belum memilikinya. Artikel ini akan membahas beberapa metode untuk memberikan akses sudo kepada pengguna di sistem operasi Debian 12. Meskipun metode ini umumnya dapat diterapkan pada berbagai distribusi Linux, contoh dalam artikel ini akan menggunakan Debian 12.

## Masuk ke sistem sebagai pengguna root

Untuk menambahkan pengguna ke grup `sudoers`, Anda memerlukan akses sebagai pengguna `root`. Jika saat ini Anda masuk sebagai pengguna *non-root*, beralihlah ke pengguna `root` dengan menjalankan perintah berikut:

```bash {lineNos=false}
sudo su -  
```

> **Catatan**: Penggunaan tanda hubung (`-`) pada perintah di atas penting. Ini memastikan bahwa sesi `root` yang dimulai memiliki lingkungan yang bersih, seolah-olah Anda login langsung sebagai `root`.

Setelah berhasil masuk sebagai pengguna `root`, ikuti langkah-langkah berikut untuk menambahkan pengguna ke grup `sudoers`.

## Menambahkan Pengguna ke Grup Sudo

Cara paling umum dan direkomendasikan untuk memberikan hak `sudo` adalah dengan menambahkan pengguna ke grup `sudo` (atau `wheel` pada beberapa distribusi). Di Debian, grup ini bernama `sudo`. Gunakan perintah `usermod` sebagai berikut (ganti NAMA_PENGGUNA dengan nama pengguna yang sebenarnya):

```bash {lineNos=false}
usermod -aG sudo NAMA_PENGGUNA
```

> **Penjelasan dari setiap opsi atau *flag*:**
>
> `-a`: Menambahkan pengguna ke grup tambahan. Tanpa opsi ini, pengguna akan dihapus dari grup lain yang mereka ikuti.
>
> `-G`: Menentukan grup tambahan yang akan ditambahkan.
>
> Anda dapat melihat semua opsi yang tersedia untuk perintah `usermod` dengan menjalankan `usermod --help`.

Untuk memverifikasi bahwa pengguna telah ditambahkan ke grup `sudo`, jalankan perintah (ganti `NAMA_PENGGUNA` dengan nama pengguna yang sebenarnya):

```bash {lineNos=false}
groups NAMA_PENGGUNA
```

Jika `sudo` muncul dalam daftar grup yang ditampilkan, berarti pengguna tersebut telah berhasil ditambahkan.

## Cara lain: Mengedit Berkas `/etc/sudoers` Secara Langsung (Hati-hati!)

Alternatifnya, Anda dapat memberikan hak `sudo` kepada pengguna tertentu tanpa menambahkannya ke grup `sudo` dengan mengedit berkas `/etc/sudoers`. **Sangat penting** untuk selalu menggunakan perintah `visudo` ketika mengedit berkas ini:

```bash {lineNos=false}
visudo
```

> **Penting**: Perintah `visudo` akan membuka berkas `/etc/sudoers` dalam editor teks dan melakukan pemeriksaan sintaks sebelum menyimpan perubahan. Hal ini krusial untuk mencegah kesalahan yang dapat mengakibatkan hilangnya akses `sudo` atau bahkan akses `root`.

Kemudian, tambahkan baris berikut di bagian akhir berkas (ganti `nama_pengguna` dengan nama pengguna yang sebenarnya):

```bash
nama_pengguna ALL=(ALL:ALL) ALL
```

Jika Anda ingin pengguna tersebut dapat menjalankan perintah `sudo` tanpa perlu untuk memasukkan kata sandi, gunakan sintaks berikut:

```bash
nama_pengguna ALL=(ALL:ALL) NOPASSWD: ALL
```

> **Catatan**: Mengizinkan pengguna untuk menjalankan perintah `sudo` tanpa kata sandi dapat menimbulkan risiko keamanan. Pastikan untuk mempertimbangkan implikasi ini sebelum menerapkan pengaturan ini.

## Verifikasi

Untuk selanjutnya, penting untuk kita melakukan ***logout* dan *login*** kembali agar dapat menggunakan perintah `sudo`. Setelah itu kita dapat melakukan uji coba dengan contoh perintah:

Agar perubahan keanggotaan grup diterapkan (jika menggunakan metode grup), atau agar sesi mengenali hak `sudo`, pengguna perlu keluar (logout) dan masuk kembali (login). Setelah itu, Anda dapat menguji akses `sudo` dengan menjalankan perintah berikut misalnya:

```bash {lineNos=false}
sudo apt update
```

Jika konfigurasi benar, perintah `sudo ...` akan meminta kata sandi pengguna (kecuali jika opsi `NOPASSWD` digunakan) dan kemudian menjalankan pembaruan paket.

## Kesimpulan

Memberikan hak akses `sudo` adalah salah satu tugas fundamental dalam administrasi sistem Linux, termasuk Debian 12. Melalui artikel ini, Anda telah mempelajari dua metode utama untuk melakukannya:

1. **Menambahkan pengguna ke grup `sudo`:** Cara ini merupakan pendekatan yang paling umum, sederhana, dan direkomendasikan untuk sebagian besar skenario karena kemudahan dalam pengelolaan.

2. **Mengedit berkas `/etc/sudoers` secara langsung menggunakan `visudo`:** Metode ini menawarkan kontrol yang lebih granular atas hak akses yang diberikan, namun memerlukan kehati-hatian ekstra untuk menghindari kesalahan konfigurasi.

Penting untuk diingat, apa pun metode yang Anda pilih:

* Selalu gunakan perintah `visudo` saat hendak memodifikasi berkas `/etc/sudoers` secara manual. Ini akan membantu mencegah kesalahan sintaks yang dapat berakibat fatal pada akses sistem.
* Setelah melakukan perubahan, jangan lupa untuk melakukan *logout* dan *login* kembali bagi pengguna yang bersangkutan, lalu verifikasi bahwa hak `sudo` berfungsi seperti yang diharapkan.

* Terapkan prinsip *least privilege* (hak istimewa paling rendah). Berikan hak akses hanya sebatas yang dibutuhkan oleh pengguna untuk melakukan tugasnya, dan pertimbangkan dengan cermat implikasi keamanan saat memberikan akses `sudo` tanpa kata sandi.

Dengan pemahaman yang telah dipaparkan, Anda kini memiliki bekal yang lebih baik untuk mengelola hak akses administratif pada sistem Debian 12 Anda secara lebih efektif dan aman. Mengelola akses dengan bijak adalah kunci untuk menjaga integritas dan keamanan sistem Anda.
