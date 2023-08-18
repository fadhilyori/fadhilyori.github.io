---
title: "Tutorial: Men-deploy Aplikasi Web Laravel Menggunakan Docker"
date: "2019-05-02"
tags: ["linux", "server", "docker", "laravel", "php"]
categories: ["tutorial"]
author: "Fadhil Yori"
draft: false
hidemeta: false
summary: "Disini saya akan menjelaskan bagaimana cara melakukan deployment aplikasi Laravel menggunakan Docker."
description: "Disini saya akan menjelaskan bagaimana cara melakukan deployment aplikasi Laravel menggunakan Docker."
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
    image: "images/image.png"
    alt: "Laravel Welcome Screen"
    caption: "Laravel Welcome Screen"
    relative: true
---

Selamat datang di blog pribadi saya. Kali ini saya ingin berbagi ilmu tentang Docker. Berawal pada saat saya mengisi acara Cangkru'an Kelompok Linux Arek Suroboyo Lokakarya Docker Fundamental pada hari sabtu kemarin di Ruang Training APJII Jawa Timur, Intiland Tower, Surabaya. Pada saat sesi demo saya mencoba untuk mendeploy aplikasi web menggunakan framework Laravel, saya berulang kali mengalami kegagalan karena masalah permission. Namun, setelah sekian kali mencoba saya berhasil untuk menjalankan aplikasi saya melalui Docker Container. Bagaimana caranya? Disini saya ingin berbagi cara untuk melakukan deploy aplikasi Laravel kita menggunakan Docker.

### Apa itu Docker?

Docker merupakan sebuah teknologi virtualisasi yang memungkinkan kita untuk mengemas, membangun dan menjalankan aplikasi yang kita buat di sistem operasi manapun yang diletakkan pada sebuah container (wadah).

### Kenapa harus Docker?

Dengan menggunakan Docker, kita jadi lebih mudah untuk proses development dan testing sebuah proyek berbasis websiste yang kita buat. Sebab dengan menggunakan Docker orang lain yang akan melakukan testing aplikasi kita tidak perlu menginstall web server dan dependency satu persatu di masing-masing sistem operasi yang mereka gunakan karena semua kebutuhan untuk aplikasi kita sudah terinstal di Docker Container.

### Praktik

#### Membuat Proyek Laravel

Untuk membuat proyek Laravel kita membutuhkan tool yang bernama Composer. Pastikan kalian sudah menginstallnya di laptop kalian masing-masing. Jika sudah menginstall Composer, lanjut untuk membuat proyek Laravel dengan mengetik perintah berikut :

```
composer create-project --prefer-dist laravel/laravel my_app
```

Kemudian jika sudah masuk ke dalam direktori proyek kita dan kemudian kita tes untuk memastikan proyek yang kita buat dapat berjalan

```
php artisan serve
```

![](images/Screenshot_20190502_083845.png)

**Gambar 1.** Hasil Output Perintah `php artisan serve`

Jika sudah berhasil harusnya aplikasi kita sudah dapat diakses.

#### Docker

Pada bagian ini pastikan kalian sudah melakukan instalasi Docker dan Docker Compose pada Ubuntu bisa dengan cara mengetik perintah ini dan kemudian tunggu hingga selesai.

```
sudo apt-get install -y docker.io docker-compose
```

#### Buat berkas-berkas yang dibutuhkan

Pada direktori proyek kita, buat dua berkas yang masing - masing bernama `app.dockerfile` yang akan kita gunakan untuk menginstall php dan extensi php yang dibutuhkan seperti extensi untuk mysql, `web.dockerfile` yang akan digunakan untuk menginstal NGINX dengan configurasi virtual host pada berkas `laravelVHost.conf`, dan \`docker-compose.yml\` yang berisi layanan yang akan kita jalankan secara bersamaan. Setelah itu isi dari masing - masing berkas tersebut adalah berikut

#### app.dockerfile

```
FROM php:7-fpm

RUN apt-get update && apt-get install -y libmcrypt-dev && apt clean
RUN pecl install mcrypt-1.0.2 && docker-php-ext-enable mcrypt
RUN apt-get install -y libfreetype6-dev libjpeg62-turbo-dev libmcrypt-dev libpng-dev && apt clean
RUN docker-php-ext-install -j$(nproc) iconv pdo_mysql 
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN docker-php-ext-install -j$(nproc) gd 

WORKDIR /var/www
```

#### web.dockerfile

```
FROM nginx:latest

ADD ./laravelVHost.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www
```

#### docker-compose.yml

```
version: '3'

services:
  web:
    build:
      context: ./
      dockerfile: web.dockerfile
    volumes:
      - ./:/var/www
    restart: always
    ports:
      - "8080:80"
    links:
      - app

  app:
    build:
      context: ./
      dockerfile: app.dockerfile
    volumes:
      - ./:/var/www
    restart: always
    links:
      - database
    environment:
      - "DB_PORT=3306"
      - "DB_HOST=database"
  
  database:
    image: mysql:latest
    hostname: database
    restart: always
    command: --default-authentication-plugin=mysql_native_password
    environment:
        MYSQL_ROOT_PASSWORD: secret
        MYSQL_DATABASE: laravelDB
    ports:
        - "33061:3306"

  cache:
    image: redis:latest
    ports: 
      - "63791:6379"
```

#### laravelVHost.conf

```
server {
    listen 80;
    index index.php index.html;
    root /var/www/public;

    location / {
        try_files $uri /index.php?$args;
    }

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }
}
```

#### .env

Kita juga perlu untuk mengatur environment pada Laravel agar kita dapat menjalankan perintah untuk melakukan migrasi database.

```
...
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=33061
DB_DATABASE=laravelDB
DB_USERNAME=root
DB_PASSWORD=secret
...
```

Setelah berkas-berkas diatas telah siap, kita dapat menjalankan perintah

```
docker-compose up -d
```

Kemudian kita dapat mengakses halaman dengan mengunjungi tautan

```
http://localhost:8080
```

Harusnya sudah muncul halaman welcome page Laravel seperti pada gambar di bawah ini.

![](https://i2.wp.com/klas.or.id/wp-content/uploads/2019/04/image.png?fit=1024%2C529&ssl=1)

**Gambar 2.** Welcome Page Laravel

Jika berhasil, kita dapat melakukan migrate menggunakan perintah di bawah. Perintah ini dijalankan melalui terminal kita pada direktori proyek Laravel kita, bukan melalui container docker yang sedang berjalan.

```
php artisan migrate
```

Hasil outputnya :

![](images/image-1.png)

**Gambar 3.** Hasil Output Menjalankan Perintah Migration Laravel

Jika sudah kita dapat mencoba untuk registrasi di halaman `http://localhost:8080/register` namun sebelumnya kita harus melakukan generate auth pada Laravel dengan menggunakan perintah :

```
php artisan make:auth
```

Perintah diatas akan membuatkan kita tampilan dan route yang dapat kita gunakan untuk autentikas user. Jika berhasil menjalankan perintah diatas, kita sudah dapat melakukan register dan login.

Selamat mencoba, maaf jika ada yang kurang. Terima kasih :)

Sumber :

- https://docs.docker.com
- https://hub.docker.com/\_/php
- https://hub.docker.com/\_/nginx
