---
title: "Free Personal DNS Server"
date: "2024-10-03"
tags: ["dns", "doh", "dot"]
categories: ["projects"]
author: "Fadhil Yori"
summary: "A free-to-use personal DNS server that supports DNS-over-HTTPS and DNS-over-TLS to protect your privacy and security."
description: "A free-to-use personal DNS server that supports DNS-over-HTTPS and DNS-over-TLS to protect your privacy and security."
ShowWordCount: false
ShowReadingTime: false
showToc: false
cover:
    image: "https://unsplash.com/photos/2m71l9fA6mg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8aW50ZXJuZXR8ZW58MHx8fHwxNzI3OTE2MjUwfDA&force=true&w=320"
    alt: "Photo by <a href=\"https://unsplash.com/@yapics?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash\">Leon Seibert</a> on <a href=\"https://unsplash.com/photos/internet-led-signage-beside-building-near-buildings-2m71l9fA6mg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash\">Unsplash</a>"
    caption: "Photo by <a href=\"https://unsplash.com/@yapics?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash\">Leon Seibert</a> on <a href=\"https://unsplash.com/photos/internet-led-signage-beside-building-near-buildings-2m71l9fA6mg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash\">Unsplash</a>"
    relative: true
    hidden: true
---

## How to Use Personal DNS Service for Web Browsers and Android

Hello everyone,

I'll provide a simple guide on how to use the Personal DNS service. This is a DNS service I personally manage, and it's free to use. The service offers both unprotected DNS and DNS with protection against ads, malware, and adult content. Below are the available DNS addresses:

**Standard DNS (no protection):**

- DNS-over-HTTPS (DoH):

  ```text
  https://free.dns.fadhilyori.my.id/dns-query
  ```

- DNS-over-TLS (DoT):

  ```text
  tls://free.dns.fadhilyori.my.id
  ```

**DNS with Protection (ads, malware, adult content):**

- DNS-over-HTTPS (DoH):

  ```text
  https://free-family.dns.fadhilyori.my.id/dns-query
  ```

- DNS-over-TLS (DoT):

  ```text
  tls://free-family.dns.fadhilyori.my.id
  ```

For those unfamiliar, DNS stands for Domain Name System, a system that maps domain names to IP addresses. DoH and DoT are two secure protocols for performing DNS queries.

This DNS can be used on many platforms. In this blog, I'll cover how to use it on web browsers and Android.

### A. How to Use DNS on Web Browsers (Supports DoH only)

1. **On Google Chrome:**

   - Open Google Chrome, click the three vertical dots at the top right, then select 'Settings.'

   - In the sidebar, click 'Privacy and security,' then click 'Security.'

   - Scroll down to the 'Advanced' section and enable 'Use secure DNS.'

   - Choose 'With custom provider' and enter the desired DNS-over-HTTPS URL.

2. **On Firefox:**

   - Open Firefox, click the three horizontal lines at the top right, then select 'Preferences.'

   - In the sidebar, click 'Privacy & Security,' then scroll down to the 'DNS over HTTPS' section.

   - Select either 'Increased Protection' or 'Max Protection.'

   - Under 'Choose a provider,' select 'Custom,' then enter the desired DNS-over-HTTPS URL.

### B. How to Use DNS on Android (DoT)

Here, I'll guide you on how to use DNS-over-TLS on Android, using Samsung's OneUI as an example. The steps may differ slightly on other operating systems. Here's how:

- Open 'Settings,' then select 'Connections.'

- Next, choose 'More connection settings,' then select 'Private DNS.'

- Choose 'Private DNS provider hostname.'

- Enter the DNS hostname in the provided field, then click 'Save.'

I hope this short tutorial helps you all achieve a safer and more comfortable internet experience. If you have any questions or need further assistance, feel free to contact me. Happy browsing!

For those who wish to support this service, you can donate through [this page (currently unavailable)](https://www.fadhilyori.my.id/donate). Thank you!
