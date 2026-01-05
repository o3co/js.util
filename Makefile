
UTILDIRS := $(shell find ./utils -type f -d 2 -name "Makefile" -exec dirname {} \;)

.PHONY: install
install:
	lefthook install
	pnpm install

.PHONY: build
build:
	@for subdir in $(UTILDIRS); do \
		make -C $$subdir build;\
	done

