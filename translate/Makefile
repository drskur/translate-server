all: translate index
translate:
	cargo lambda build --release --bin translate --target aarch64-unknown-linux-gnu
index:
	cargo lambda build --release --bin index --target aarch64-unknown-linux-gnu