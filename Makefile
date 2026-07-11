.PHONY: server build new-post update-theme clean help

help:
	@echo "Usage:"
	@echo "  make server        - Run local Hugo server"
	@echo "  make build         - Build the site (minify)"
	@echo "  make new-post      - Create a new bilingual post"
	@echo "  make update-theme  - Update git submodules (PaperMod)"
	@echo "  make clean         - Remove public directory"

server:
	hugo server -D

build:
	hugo --minify

new-post:
	@if [ -z "$(TITLE)" ]; then \
		echo 'Usage: make new-post TITLE="Judul Post" [TITLE_EN="English Title"]'; \
		exit 1; \
	fi
	@bash scripts/new-post.sh "$(TITLE)" "$(TITLE_EN)"

update-theme:
	git submodule update --remote --merge

clean:
	rm -rf public
