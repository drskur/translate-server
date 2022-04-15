use actix_web::dev::ServiceRequest;
use actix_web::{Error, HttpResponse};
use actix_web::error::ErrorUnauthorized;
use actix_web_httpauth::extractors::basic::BasicAuth;
use actix_web_httpauth::middleware::HttpAuthentication;
use actix_web::http::header::ContentType;
use lambda_web::actix_web::{self, get, App, HttpServer};
use lambda_web::{is_running_on_lambda, run_actix_on_lambda, LambdaError};

async fn validator(req: ServiceRequest, credentials: BasicAuth) -> Result<ServiceRequest, Error> {

    if credentials.user_id() != "drskur" {
        return Err(ErrorUnauthorized("unauthorized"))
    }

    Ok(req)
}

#[actix_web::main]
async fn main() -> Result<(),LambdaError> {
    let factory = move || {
        let auth = HttpAuthentication::basic(validator);
        App::new()
            .wrap(auth)
            .service(index)
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