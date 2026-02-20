
.PHONY: typecheck 
typecheck:
	pnpm run typecheck 

.PHONY: build 
build:
	pnpm run build 

.PHONY: clean
clean:
	rm tsconfig.tsbuildinfo
	rm -rf built

.PHONY: test
test: clean build
	pnpm run test