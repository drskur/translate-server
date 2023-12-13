use actix_web::{Error, HttpResponse, get};
use serde_json::json;

#[get("/")]
pub async fn handler() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().json(json!({
        "health": "ok"
    })))
}