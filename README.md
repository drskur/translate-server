# Translate Server

Simple translate(en -> ko) web app deployed on AWS Lambda.

```
                           ┌─────────┐      ┌─────────────┐      ┌───────────┐
            ┌─────────┐    │   API   │      │ AWS Lambda  │      │  Amazon   │
 User ─────▶│ Route53 │───▶│ GATEWAY │─────▶│ (Actix App) │◀────▶│ Translate │
            └─────────┘    └─────────┘      └─────────────┘      └───────────┘
```

## Usage

```bash

# install deps
$ cargo install cargo-lambda
$ npm i

# build rust app
$ npm run build

# deploy
$ npx cdk deploy

```
