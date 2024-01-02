use actix_web::{Error, HttpResponse, get};
use async_stream::try_stream;
use serde_json::json;

#[get("/")]
pub async fn handler() -> Result<HttpResponse, Error> {
    let stream = try_stream! {

    };

    Ok(HttpResponse::Ok().json(json!({
        "health": "ok"
    })))
}