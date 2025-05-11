---
title: "PyWebScraper"
date: "2025-02-28"
tags: ["webscraper", "webscraping", "beautifulsoup4", "webscraping-beautifulsoup"]
categories: ["projects"]
author: ["Fadhil Yori"]
summary: "PyWebScraper merupakan web scraper sederhana yang menggunakan BeautifulSoup untuk melakukan web scraping. Proyek ini masih dalam tahap awal pengembangan dan awalnya ditujukan untuk penggunaan pribadi."
description: "Web Scraper Python Package"
ShowWordCount: false
ShowReadingTime: false
showtoc: false
---

> Project URL: [GitHub Repository](https://github.com/fadhilyori/pywebscraper)

A simple web scraper that uses the BeautifulSoup library to scrape the web. This project is still early in development and initially for personal use.

## Features

- Scrape a website content
- Save to a file in Markdown or HTML format
- Image download support
- Get all images links in the website content
- Get all links in the website content with or without the relative links

## Requirements

- Python 3.10+

## Installation

To install the package, run the following command:

```bash
pip install git+https://github.com/fadhilyori/pywebscraper.git
```

## Usage

### Initialize the PyWebScraper class

```python
from pywebscraper import PyWebScraper

url = 'https://www.example.com'

scraper = PyWebScraper(url)
```

> **Note:**  
> The default output directory is in the output directory.

### Scrape a website content and save to a file in Markdown format

```python
output_file = 'output.md'
scraper.save_markdown(filename=output_file)
```

### Scrape a website content and save to a file in HTML format

```python
output_file = 'output.html'
scraper.save_content_html(filename='content.html')
```

### Scrape a website content and download images

```python
output_file = 'output.md'
scraper.save_markdown(filename=output_file, download_images=True)
```

### Get the website Markdown content in a string

```python
content = scraper.get_content_markdown()
print(content)
```

Example output:

```markdown { lineNos=false }
# Example Domain

This domain is for use in illustrative examples in documents. You may use this
domain in literature without prior coordination or asking for permission.

[More information...](https://www.iana.org/domains/example)
```

### Get all images in the website content

```python
images = scraper.extract_images()
print(images)
```

Example output:

```python { lineNos=false }
[
    ('alt_text1', 'https://www.example.com/image1.jpg'),
    ('alt_text2', 'https://www.example.com/image2.jpg'),
]
```

### Get all the links in the content (including the relative links)

```python
links = scraper.extract_links()
print(links)
```

Example output:

```python { lineNos=false }
[
    # External links
    'https://www.example.org/about',

    # Relative links
    'https://www.example.com/page3',    # original: /page3
    'https://www.example.com/#section', # original: # #section
    'https://www.example.com/?search=python', # original: # ?search=python
]
```

### Get all the links in the content (exclude the relative links)

```python
links = scraper.extract_links(include_relative=False)
print(links)
```

Example output:

```python { lineNos=false }
[
    'https://www.example.org/about',
]
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
