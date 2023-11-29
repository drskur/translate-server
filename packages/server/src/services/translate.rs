use actix_web::{Error, HttpResponse, post};
use actix_web::web::Json;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Deserialize, Serialize)]
struct TranslateInput {
    text: String,
}

#[post("/api/translate")]
pub async fn handler(msg: Json<TranslateInput>) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().json(json!({
        "hello": &msg.text
    })))
}