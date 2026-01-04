.PHONY: server build update-theme clean help

help:
	@echo "Usage:"
	@echo "  make server        - Run local Hugo server"
	@echo "  make build         - Build the site (minify)"
	@echo "  make update-theme  - Update git submodules (PaperMod)"
	@echo "  make clean         - Remove public directory"

server:
	hugo server -D

build:
	hugo --minify

update-theme:
	git submodule update --remote --merge

clean:
	rm -rf public
