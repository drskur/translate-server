build:
	cargo lambda build --release --target aarch64-unknown-linux-gnu
	mkdir -p ./.dist
	cp target/lambda/server/bootstrap ./.dist/
codepipeline:
	cargo build --release
	mkdir -p ./.dist
	cp target/release/server ./.dist/bootstrap