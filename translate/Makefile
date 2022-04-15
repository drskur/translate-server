build:
	cargo lambda build --bin app --target aarch64-unknown-linux-gnu
	mkdir -p ../.dist
	cp target/lambda/app/bootstrap ../.dist/
