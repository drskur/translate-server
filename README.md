# Translate Server

Simple translate web app deployed on AWS Lambda.

```
                           ┌─────────┐      ┌─────────────┐      ┌───────────┐
            ┌─────────┐    │   API   │      │ AWS Lambda  │      │  Amazon   │
 User ─────▶│ Route53 │───▶│ GATEWAY │─────▶│ (Actix App) │◀────▶│ Translate │
            └─────────┘    └─────────┘      └─────────────┘      └───────────┘
```
