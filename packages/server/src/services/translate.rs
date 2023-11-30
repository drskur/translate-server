use std::sync::Arc;
use actix_web::{Error, HttpResponse, post, web};
use actix_web::error::ErrorInternalServerError;
use actix_web::web::Json;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::app_state::AppState;

#[derive(Deserialize, Serialize)]
struct TranslateInput {
    text: String,
    source_language_code: String,
    target_language_code: String,
}

#[post("/v1/translate")]
pub async fn handler(msg: Json<TranslateInput>, data: web::Data<Arc<AppState>>) -> Result<HttpResponse, Error> {
    let client = aws_sdk_translate::Client::new(&data.shared_config);

    let mut lines = vec![];

    for line in msg.text.split("\n") {
        if line.trim().is_empty() {
            continue;
        }

        let translate = client.translate_text()
            .source_language_code(&msg.source_language_code)
            .target_language_code(&msg.target_language_code)
            .text(line)
            .send()
            .await
            .map_err(|e| ErrorInternalServerError(e.into_service_error()))?;

        lines.push(translate.translated_text);
    }

    let result = lines.join("\n");

    Ok(HttpResponse::Ok().json(json!({
        "translatedText": result
    })))
}