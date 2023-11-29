# Translate Server

Simple translate(en -> ko) web app deployed on AWS Lambda.

```
            ┌─────────┐      ┌─────────────┐      ┌───────────┐
            │   API   │      │ AWS Lambda  │      │  Amazon   │
 User ─────▶│ GATEWAY │─────▶│ (Actix App) │◀────▶│ Translate │
            └─────────┘      └─────────────┘      └───────────┘
```

## Usage

```bash

# install deps
$ cargo install cargo-lambda
$ npm i

# build rust server
$ cd packages/server
$ make build

# deploy
$ npx cdk deploy TranslateServerStack

# CDK Pipeline
# You need create github token(classic), <admin:repo_hook> and <repo> permission is needed. (classic)
# You need create github token(fine-grained), repository permission - Webhooks Access: Read and write)
$ aws secretsmanager create-secret --name github-access-token-secret --description "Github access token" --secret-string <GITHUB_ACCESS_TOKEN> --region <REGION>

# if you'll use aws file
$ export AWS_PROFILE=<your aws profile>
$ cd packages/infra
$ pdk deploy:codepipeline
```
