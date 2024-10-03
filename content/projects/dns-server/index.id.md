---
title: "Free Personal DNS Server"
date: "2024-10-03"
tags: ["dns", "doh", "dot"]
categories: ["projects"]
author: "Fadhil Yori"
summary: "Server DNS pribadi gratis yang mendukung DNS-over-HTTPS dan DNS-over-TLS untuk melindungi privasi dan keamanan Anda."
description: "Server DNS pribadi gratis yang mendukung DNS-over-HTTPS dan DNS-over-TLS untuk melindungi privasi dan keamanan Anda."
ShowWordCount: false
ShowReadingTime: false
showToc: true
TocOpen: false
cover:
  image: "https://unsplash.com/photos/2m71l9fA6mg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8aW50ZXJuZXR8ZW58MHx8fHwxNzI3OTE2MjUwfDA&force=true&w=640"
  alt: 'Photo by <a href="https://unsplash.com/@yapics?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Leon Seibert</a> on <a href="https://unsplash.com/photos/internet-led-signage-beside-building-near-buildings-2m71l9fA6mg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
  caption: 'Photo by <a href="https://unsplash.com/@yapics?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Leon Seibert</a> on <a href="https://unsplash.com/photos/internet-led-signage-beside-building-near-buildings-2m71l9fA6mg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
  relative: true
  hidden: true
---

## Cara Menggunakan Personal DNS Service Untuk Web Browser dan Android

Hai semua,

Saya akan memberikan panduan simpel bagaimana menggunakan Personal DNS service. Personal DNS Service ini adalah layanan DNS yang saya kelola sendiri dan bisa digunakan secara gratis. Layanan ini menyediakan DNS tanpa proteksi dan DNS dengan proteksi iklan, malware, dan adult content. Berikut daftar DNS yang bisa digunakan:

DNS Standar (tanpa proteksi):

- DNS-over-HTTPS (DoH):

  ```text
  https://free.dns.fadhilyori.my.id/dns-query
  ```

- DNS-over-TLS (DoT):

  ```text
  tls://free.dns.fadhilyori.my.id
  ```

DNS dengan Proteksi (iklan, malware, adult content):

- DNS-over-HTTPS (DoH):

  ```text
  https://free-family.dns.fadhilyori.my.id/dns-query
  ```

- DNS-over-TLS (DoT):

  ```text
  tls://free-family.dns.fadhilyori.my.id
  ```

Bagi yang belum tahu, DNS adalah singkatan dari Domain Name System, yaitu suatu sistem yang memetakan nama domain ke alamat IP. Sedangkan DoH dan DoT adalah dua protokol aman untuk melakukan query DNS.

Penggunaan DNS ini bisa dilakukan di banyak platform, di blog ini saya akan membahas penggunaannya di web browser dan Android.

> ⚠️**Catatan**:
>
> DNS server bisa mencatat domain yang Anda akses. Oleh karena itu, pastikan Anda menggunakan DNS server yang Anda percayai. Server ini tidak menyimpan log pencarian DNS atau aktivitas pengguna secara rutin. Namun, dalam beberapa kasus, log mungkin perlu disimpan untuk keperluan pemantauan dan perbaikan jika terjadi masalah atau serangan terhadap server ini.
>
> Apabila terdapat masalah atau pertanyaan, jangan ragu untuk menghubungi saya.

### A. Cara Menggunakan DNS di Web Browser (Hanya mendukung DoH)

1. **Pada Google Chrome**:

   - Buka browser Google Chrome, lalu klik tiga titik vertikal di kanan atas, lalu pilih 'Settings'.

   - Pada sidebar, klik 'Privacy and security'. Kemudian klik 'Security'.

   - Scroll ke bawah ke bagian 'Advanced' dan aktifkan 'Use secure DNS'.

   - Pilih 'With custom provider' dan masukkan URL DNS-over-HTTPS yang diinginkan.

2. **Pada Firefox**:

   - Buka browser Firefox, lalu klik tiga garis horizontal di kanan atas, lalu pilih 'Preferences'.

   - Pada sidebar, klik 'Privacy & Security'. Kemudian scroll ke bawah ke bagian 'DNS over HTTPS'.

   - Pilih salah satu antara 'Increased Protection' atau 'Max Protection'.

   - Kemudian pada 'Choose a provider', pilih 'Custom'. Dan masukkan URL DNS-over-HTTPS yang diinginkan.

### B. Cara Menggunakan DNS di Android (DoT)

Di sini saya akan memberikan panduan menggunakan DNS-over-TLS di Android dengan contoh pada Sistem Operasi OneUI Samsung. Untuk sistem operasi lain, langkah-langkahnya mungkin sedikit berbeda. Berikut langkah-langkahnya:

- Buka 'Settings', lalu pilih 'Connections'.

- Kemudian pilih 'More connection settings'. Lalu pilih 'Private DNS'.

- Pilih 'Private DNS provider hostname'.

- Masukkan hostname DNS di kolom yang disediakan tanpa menggunakan `tls://` (contoh: `free.dns.fadhilyori.my.id`), lalu klik 'Save'.

Semoga tutorial singkat ini bisa membantu kalian semua untuk mendapatkan akses internet yang lebih aman dan nyaman. Jika ada pertanyaan atau perlu bantuan lebih lanjut, jangan ragu untuk kontak saya. Selamat mencoba!

Untuk rekan-rekan yang ingin mendukung layanan ini, dapat memberikan donasi melalui [halaman ini (sementara belum bisa)](https://www.fadhilyori.my.id/donate). Terima kasih.
