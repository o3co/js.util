
UTILDIRS := $(shell find ./utils -type f -d 2 -name "Makefile" -exec dirname {} \;)

.PHONY: install
install:
	lefthook install
	npm install

.PHONY: all/build
all/build:
	@for subdir in $(UTILDIRS); do \
		make -C $$subdir build;\
	done

