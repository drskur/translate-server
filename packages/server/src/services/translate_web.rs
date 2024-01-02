use std::sync::Arc;
use actix_web::{Error, HttpResponse, post, web};
use actix_web::error::{ErrorBadRequest, ErrorInternalServerError};
use actix_web::web::Json;
use aws_sdk_translate::primitives::Blob;
use aws_sdk_translate::types::builders::DocumentBuilder;
use nipper::Document;
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::app_state::AppState;


#[derive(Deserialize, Serialize)]
struct TranslateInput {
    url: String,
    source_language_code: String,
    target_language_code: String,
}

#[post("/v1/translate/url")]
pub async fn handler(msg: Json<TranslateInput>, data: web::Data<Arc<AppState>>) -> Result<HttpResponse, Error> {
    let client = aws_sdk_translate::Client::new(&data.shared_config);

    let response = reqwest::get(&msg.url).await.map_err(|e| ErrorBadRequest(e))?;

    let html = response.text().await.map_err(|e| ErrorInternalServerError(e))?;

    let doc = DocumentBuilder::default()
        .content_type("text/html")
        .content(Blob::new(html))
        .build()
        .map_err(|e| ErrorInternalServerError(e))?;

    let translate = client.translate_document()
        .source_language_code(&msg.source_language_code)
        .target_language_code(&msg.target_language_code)
        .document(doc)
        .send()
        .await
        .map_err(|e| ErrorInternalServerError(e.into_service_error()))?;

    let result = translate.translated_document.unwrap().content;

    Ok(HttpResponse::Ok().json(json!({
        "translatedHtml": result
    })))
}

// fn translate_element()