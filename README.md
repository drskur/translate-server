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

# build rust app
$ npm run build

# deploy
$ npx cdk deploy TranslateServerStack

# CDK Pipeline
# You need create github token, <admin:repo_hook> and <repo> permission is needed.
$ aws secretsmanager create-secret --name github-access-token-secret --description "Github access token" --secret-string <GITHUB_ACCESS_TOKEN> --region <REGION>
$ npx cdk deploy TranslateServerCdkPipelineStack
```
