---
title: "Cara install Nginx, PHP7, MySQL dan phpMyAdmin di Ubuntu"
date: "2019-02-19"
tags: ["linux", "nginx", "php", "mysql", "ubuntu", "sysadmin"]
categories: ["tutorial"]
author: "Fadhil Yori"
draft: false
hidemeta: false
summary: "Disini saya akan menjelaskan bagaimana cara melakukan persiapan deployment untuk aplikasi PHP di server menggunakan Ubuntu."
description: "Disini saya akan menjelaskan bagaimana cara melakukan persiapan deployment untuk aplikasi PHP di server menggunakan Ubuntu."
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
    image: "images/gambar-1-welcome-screen-nginx.png"
    alt: "Nginx Welcome Screen"
    caption: "Nginx Welcome Screen"
    relative: true
---

Kali ini saya akan berbagi bagaimana cara melakukan instalasi Nginx, PHP7, MariaDB, dan phpMyAdmin. Pada tutorial ini saya menggunakan Ubuntu 16.04 LTS. Kita langsung saja ke pembahasan.

### Hal-hal yang dibutuhkan :

- Akses root (sudo)
- Koneksi internet

### Langkah 1 : Memasang paket Nginx

Untuk memasang Nginx, pastikan kamu mempunyai akses sebagai _superuser_ (root). Bagaimana cara menginstall Nginx? Pertama kita update sistem terlebih dahulu dan kemudian memasang nginx :

$ sudo apt update   
$ sudo apt upgrade -y   
$ sudo apt install -y nginx

### Langkah 2 : Mengatur Firewall

Sebelum menguji Nginx, perangkat lunak firewall perlu disesuaikan kembali untuk mengijinkan akses ke layanan. Caranya dengan mendaftarkan layanan Nginx dengan ufw.

$ sudo ufw app list   
  
**Output**   
Available applications:  
   Nginx Full  
   Nginx HTTP  
   Nginx HTTPS  
   OpenSSH

Terdapat tiga pilihan aplikasi yang dapat kita pilih sesuai kebutuhan kita, yaitu :

- Nginx Full : Profil ini membuka/mengijinkan port 80 (HTTP) dan port 443 (HTTPS).
- Nginx HTTP : Profil ini membuka/mengijinkan port 80 (HTTP).
- Nginx HTTP : Profil ini membuka/mengijinkan port 443 (HTTPS).

Kemudian untuk mengaplikasikan salah satu profil, yaitu dengan menggunakan perintah :

$ sudo ufw allow 'Nginx Full'   
  
**Output**   
Rules updated   
Rules updated (v6)

Kemudian kita bisa memverifikasi perubahan dengan menggunakan perintah :

$ sudo ufw status

**Output**   
Status: active   
  
To                         Action      From   
\-- ------ ---- 
OpenSSH                    ALLOW       Anywhere  
Nginx HTTP                 ALLOW       Anywhere  
OpenSSH (v6)               ALLOW       Anywhere (v6)  
Nginx HTTP (v6)            ALLOW       Anywhere (v6)

### Langkah 3 : Memeriksa Web Server

Setelah melakukan langkah - langkah diatas, kita sudah dapat menggunakan web server kita.

Pertama kita cek dulu status layanan Nginx :

$ sudo systemctl status nginx   
  
**Output**  
 ● nginx.service - A high performance web server and a reverse proxy server  
    Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)  
    Active: **active (running)** since Sat 2019-02-23 15:31:54 WIB; 2min 32s ago  Main PID: 1651 (nginx)  
    CGroup: /system.slice/nginx.service  
            ├─1651 nginx: master process /usr/sbin/nginx -g daemon on; master\_process on  
            ├─1652 nginx: worker process  
            └─1653 nginx: worker process

Maka harusnya statusnya 'active' atau 'running'. Jika masih inactive aktifkan dengan cara :

Untuk menjalankan layanan nginx pada saat sistem menyala pertama kali :

$ sudo systemctl enable nginx  
  
**Output**   
Synchronizing state of nginx.service with SysV init with /lib/systemd/systemd-sysv-install...   
Executing /lib/systemd/systemd-sysv-install enable nginx

Untuk menjalankan layanan nginx secara langsung :

$ sudo systemctl start nginx

Lalu masuk ke alamat `http://localhost` pada browser yang biasa anda gunakan maka browser akan menampilkan tampilan 'Welcome to Nginx'.

![](https://fadhilyori.files.wordpress.com/2019/02/gambar-1-welcome-screen-nginx.png?w=300)

Gambar 1-Welcome Screen Nginx

### Langkah 4 : Memasang MySQL

Tahap selanjutnya yaitu melakukan pemasangan database server. Pada tutorial ini akan menggunakan MySQL. Pemasangannya cukup mudah yaitu dengan mengetik perintah :

$ sudo apt install mysql-server

Setelah instalasi selesai, kita lakukan konfigurasi dasar yaitu dengan mengetik perintah dibawah lalu tekan enter.

$ sudo mysql\_secure\_installation

Tekan enter jika ditanya password, karena kita baru melakukan pemasangan maka password root default mysql kosong. Selanjutnya ditanya apakah kita ingin mengeset password baru untuk root, kita pilih **Y**. Kemudian masukkan password baru kita untuk root. Selanjutnya, akan ditanya tentang konfigurasi dasar, kita cukup dengan mengetik **Y** untuk setiap pertanyaan sampai konfigurasi selesai.

### Langkah 5 : Memasang PHP dan Mengkonfigurasi Nginx agar dapat menggunakan PHP

Langkah selanjutnya yaitu memasang PHP dan melakukan konfigurasi pada Nginx agar dapat menjalankan berkas PHP. Langkah pertama pada bagian ini yaitu dengan menginstall paket php-fpm dimana kepanjangan dari fpm yaitu fastCGI process manager. Perlunya paket ini pada Nginx karena Nginx sendiri tidak mendukung secara bawaan terhadap PHP. Perintah dibawah dapat disesuaikan dengan versi PHP yang kalian gunakan seperti misalnya php7.2-fpm.

$ sudo apt install -y php7.0-fpm php7.0-mysql

Jika sudah, langkah selanjutnya yaitu membuat _virtual host_ untuk domain kita. Misalnya kita disini membuat domain example.com.

$ sudo nano /etc/nginx/sites-available/example.com

Kemudian masukkan kode berikut

```
server {
```

Berikut adalah penjelasan dari setiap baris kode diatas :

- `Listen` - Menentukan port apa yang akan didengarkan Nginx. Dalam hal ini, ia akan mendengarkan pada port 80, port default untuk HTTP.
- `root` - Menentukan akar dokumen tempat berkas yang dilayani oleh situs web disimpan.
- `index` - Mengkonfigurasi Nginx untuk memprioritaskan berkas yang dijalankan bernama index.php saat berkas indeks diminta, jika tersedia.
- `server_name` - Menentukan blok server mana yang harus digunakan untuk permintaan yang diberikan ke server Anda. Arahkan arahan ini ke nama domain server Anda atau alamat IP publik.
- `location /` - Blok lokasi pertama mencakup arahan `try_files`, yang memeriksa keberadaan berkas yang cocok dengan permintaan URI. Jika Nginx tidak dapat menemukan berkas yang sesuai, itu akan mengembalikan kesalahan 404.
- `location ~ \.php$` - Blok lokasi ini menangani pemrosesan PHP aktual dengan mengarahkan Nginx ke berkas konfigurasi `fastcgi-php.conf` dan berkas `php7.0-fpm.sock`, yang menyatakan soket apa yang dikaitkan dengan `php-fpm`. Jangan lupa mengganti `php7.0` dengan versi php yang kalian gunakan.
- `location ~ /\.ht` - Blok lokasi terakhir berkaitan dengan berkas `.htaccess`, yang tidak diproses oleh Nginx. Dengan menambahkan arahan `deny all`, jika ada berkas `.htaccess` terjadi untuk menemukan jalan mereka ke root dokumen, mereka tidak akan disajikan kepada pengunjung.

Bagi teman - teman yang ingin menggunakan web server ini untuk menyajikan WordPress, untuk bagian ini

```
location / {
```

diganti menjadi :

```
location / {
```

Hal ini karena kita akan memaksa untuk mendapatkan request dari berkas bawaan `index.php` pada dokumen root WordPress.

Setelah menyimpan dan menutup berkas tersebut. Aktifkan _virtual host_ yang kita buat dengan cara membuat _symbolic link_ dari berkas yang kita buat di direktori`/etc/nginx/sites-available/` ke direktori `/etc/nginx/sites-enabled/`.

$ sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

Kemudian kita melakukan pengecekan sintaksis dari berkas konfigurasi. Jika terdapat error, kembali dan lakukan pengecekan sebelum melanjutkan.

$ sudo nginx -t

Setelah tidak ada error, kita dapat menjalankan ulang layanan Nginx agar dapat menerapkan pembaruan yang sudah kita lakukan.

$ sudo systemctl reload nginx

### Langkat 6 : Membuat Berkas PHP untuk Tes Konfigurasi

Web server kita harusnya sudah siap. Kita dapat melakukan tes untuk memastikan bahwa Nginx dapat dengan benar menjalankan berkas PHP. Untuk melakukan ini, kita dapat membuat berkas dengan nama `info.php` dalam direktori root `/var/www/html/`.

$ sudo nano /var/www/html/info.php

Masukkan kode berikut

<?php  
phpinfo();

Jika sudah, kemudian simpan dan tutup berkas tersebut. Sekarang kita dapat melihat hasilnya dengan menggunakan web browser dengan mengunjungi alamat : `http://localhost/info.php` Seharusnya kalian melihat halaman web seperti dibawah ini. Halaman ini dibuat oleh PHP yang berisi tentang server kita.

![](https://fadhilyori.files.wordpress.com/2019/02/gambar-2-berkas-info.php_.png?w=300)

Gambar 2-Halaman info.php

### Langkah 7 : Memasang phpMyAdmin

Langkah terakhir yaitu memasang phpMyAdmin. Untuk installnya cukup mudah hanya beberapa langkah saja. Pertama install dulu menggunakan perintah :

$ sudo apt install -y phpmyadmin

Pada saat instalasi akan ditanya tentang konfigurasi pada web server secara otomatis, namun karena kita menggunakan Nginx kita lewati saya langsung klik oke dengan cara tab kemudian enter.

![](https://fadhilyori.files.wordpress.com/2019/02/gambar-3-pertanyaan-konfigurasi-phpmyadmin.png?w=300)

Gambar 3-Pertanyaan konfigurasi phpMyAdmin

Setelah instalasi berhasil, kita atur agar phpMyAdmin dapat berjalan pada Nginx dengan menggunakan _symbolic link_.

$ sudo ln -s /usr/share/phpmyadmin /var/www/html

Setelah itu kita dapat mengecek pada web browser kita dengan mengunjungi `http://localhost/phpmyadmin`

![](https://fadhilyori.files.wordpress.com/2019/02/gambar-4-halaman-phpmyadmin.png?w=300)

Gambar 4-Halaman phpMyAdmin

Cukup sudah tutorial kali ini, terima kasih yang sudah mengunjungi blog saya. Jika masih ada pertanyaan jangan sungkan-sungkan untuk bertanya. Mohon maaf jika ada kesalahan dalam tutorial ini.
