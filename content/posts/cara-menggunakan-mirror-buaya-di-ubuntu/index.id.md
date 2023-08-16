---
slug: cara-menggunakan-mirror-buaya.klas.or.id-di-ubuntu
title: "Cara Menggunakan Mirror buaya.klas.or.id di Ubuntu"
date: "2021-09-12"
tags: ["linux", "mirror", "repository", "buaya", "klas"]
categories: ["tutorial"]
author: "Fadhil Yori"
draft: false
hidemeta: false
summary: "Bagaimana sih menggunakan mirror Ubuntu lokal? mari kita bahas disini."
description: "Bagaimana sih menggunakan mirror Ubuntu lokal? mari kita bahas disini."
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
    image: "buaya.klas.or.id-cover.png" # image path/url
    alt: "Landing Page buaya.klas.or.id" # alt text
    caption: "Landing Page buaya.klas.or.id" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: false # only hide on current single page
---

## Apa itu Buaya KLAS?
Buaya KLAS merupakan mirror Linux gratis yang dirawat oleh teman-teman KLAS (Kelompok Linux Arek Suroboyo) dimana server ini berada di daerah Kota Surabaya, Indonesia. Saat ini ada 6 distribusi Linux yang ada di Buaya, yaitu: 
- [Ubuntu](https://buaya.klas.or.id/ubuntu)
- [Ubuntu Ports](http://buaya.klas.or.id/ubuntu-ports)
- [openSUSE Leap](http://buaya.klas.or.id/opensuse)
- [Arch Linux](http://buaya.klas.or.id/arch)
- [AlmaLinux](http://buaya.klas.or.id/almalinux)
- [Debian](http://buaya.klas.or.id/debian)
- [LibreOffice](http://buaya.klas.or.id/tdf/libreoffice)

Bagi kalian yang berada di Indonesia khususnya daerah Jawa Timur, kalian bisa menggunakan mirror Buaya atau menggunakan mirror lain yang berada di Indonesia agar waktu untuk mengunduh paket atau sekadar mengecek update bisa lebih efisien dan relatif lebih cepat.

## Bagaimana cara menggunakan mirror Buaya KLAS di Ubuntu?
Kita langsung ke pembahasan, disini saya akan memberikan tutorial melalui _Graphical User Interface_ atau GUI dan melalui terminal.

### Melalui GUI
1. Buka aplikasi "_Software & Updates_"
2. Pada bagian "_Download from:_", pilih _Other..._
![Gambar 1 - Tampilan aplikasi _Software & Updates_](how-to-use-gui-3.png)
3. Kemudian cari Indonesia dan lebarkan, kemudian pilih buaya.klas.or.id
![Gambar 2 - Tampilan daftar server](how-to-use-gui-4.png)
4. Dan kemudian klik tombol "Choose server"
5. Setelah itu bisa tutup aplikasi dan jangan lupa untuk memperbarui paket

### Melalui Terminal
1. Sunting `/etc/apt/sources.list` dengan editor teks
2. Ganti semua URL bawaan ke URL Buaya KLAS `https://buaya.klas.or.id/ubuntu/`

    Example : 
    ```
    deb https://buaya.klas.or.id/ubuntu/ focal main 
    deb-src https://buaya.klas.or.id/ubuntu/ focal main 
    ```
3. Simpan perubahan
4. Jangan lupa untuk update paket dengan perintah `sudo apt update`