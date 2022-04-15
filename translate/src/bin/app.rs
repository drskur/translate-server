use std::sync::Arc;
use actix_web::dev::ServiceRequest;
use actix_web::{Error, HttpResponse, Result, web};
use actix_web::error::{ErrorInternalServerError, ErrorUnauthorized};
use actix_web_httpauth::extractors::basic::BasicAuth;
use actix_web_httpauth::middleware::HttpAuthentication;
use actix_web::middleware::Logger;
use actix_web::http::header::ContentType;
use actix_web::web::Json;
use lambda_web::actix_web::{self, get, post, App, HttpServer};
use lambda_web::{is_running_on_lambda, run_actix_on_lambda, LambdaError};
use serde::{Deserialize, Serialize};
use serde_json::json;
use env_logger::Env;

async fn validator(req: ServiceRequest, credentials: BasicAuth) -> Result<ServiceRequest, Error> {

    if credentials.user_id() != "drskur" {
        return Err(ErrorUnauthorized("unauthorized"))
    }

    Ok(req)
}

struct AppState {
    shared_config: aws_types::SdkConfig
}

impl AppState {
    async fn load_from_env() -> AppState {
        let shared_config = aws_config::load_from_env().await;
        AppState{
            shared_config
        }
    }
}

#[actix_web::main]
async fn main() -> Result<(),LambdaError> {

    env_logger::init_from_env(Env::default().default_filter_or("info"));

    let state = Arc::new(AppState::load_from_env().await);

    let factory = move || {
        let auth = HttpAuthentication::basic(validator);
        App::new()
            .app_data(web::Data::new(state.clone()))
            .wrap(auth)
            .wrap(Logger::default())
            .service(index)
            .service(translate)
    };

    if is_running_on_lambda() {
        run_actix_on_lambda(factory).await?;
    } else {
        HttpServer::new(factory)
            .bind("127.0.0.1:8080")?
            .run()
            .await?;
    }
    Ok(())
}

#[get("/")]
async fn index() -> HttpResponse {
    let html = include_str!("index.html");

    HttpResponse::Ok()
        .content_type(ContentType::html())
        .body(html)
}

#[derive(Deserialize, Serialize)]
struct TranslateMsg {
    text: String
}

#[post("/api/translate")]
async fn translate(msg: Json<TranslateMsg>, data: web::Data<Arc<AppState>>) -> Result<HttpResponse, Error> {
    let client = aws_sdk_translate::Client::new(&data.shared_config);

    let mut lines = vec![];

    for line in msg.text.split("\n") {
        if line.trim().is_empty() {
            continue;
        }

        let translate = client.translate_text()
            .source_language_code("en")
            .target_language_code("ko")
            .text(line)
            .send()
            .await
            .map_err(|e| ErrorInternalServerError(e))?;

        lines.push(line.to_string());
        lines.push(translate.translated_text.unwrap_or("".to_string()));
        lines.push("".to_string());
    }

    let result = lines.join("\n");

    Ok(HttpResponse::Ok()
        .json(json!({
            "translatedText": result
        })))
}