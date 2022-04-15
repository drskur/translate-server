# Translate Server

Simple translate(en -> ko) web app deployed on AWS Lambda.

```
                           ┌─────────┐      ┌─────────────┐      ┌───────────┐
            ┌─────────┐    │   API   │      │ AWS Lambda  │      │  Amazon   │
 User ─────▶│ Route53 │───▶│ GATEWAY │─────▶│ (Actix App) │◀────▶│ Translate │
            └─────────┘    └─────────┘      └─────────────┘      └───────────┘
```
