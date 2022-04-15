build:
	cargo lambda build --release --bin app --target aarch64-unknown-linux-gnu
	mkdir -p ../.dist
	cp target/lambda/app/bootstrap ../.dist/
codebuild:
    cargo build --release --bin app
    mkdir -p ../.dist
    cp target/release/app ../.dist/bootstrap